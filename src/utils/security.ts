/**
 * Utilitaires de sécurité pour l'application de veille juridique
 * Validation, sanitisation et protection contre les attaques communes
 */

import DOMPurify from 'dompurify';
import { z } from 'zod';
import { log } from './logger';

// Types pour la sécurité
export interface SecurityConfig {
  enableXSSProtection: boolean;
  enableCSRFProtection: boolean;
  enableRateLimiting: boolean;
  maxRequestsPerMinute: number;
  sessionTimeout: number;
}

export interface ValidationRule<T> {
  validator: z.ZodSchema<T>;
  errorMessage: string;
}

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripUnknown?: boolean;
}

// Configuration de sécurité par défaut
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableXSSProtection: true,
  enableCSRFProtection: true,
  enableRateLimiting: true,
  maxRequestsPerMinute: 100,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

// Sanitisation XSS
export class XSSProtection {
  private static instance: XSSProtection;
  private purify: typeof DOMPurify;

  private constructor() {
    this.purify = DOMPurify;
    this.configurePurify();
  }

  static getInstance(): XSSProtection {
    if (!XSSProtection.instance) {
      XSSProtection.instance = new XSSProtection();
    }
    return XSSProtection.instance;
  }

  private configurePurify(): void {
    // Configuration personnalisée pour les documents juridiques
    this.purify.addHook('beforeSanitizeElements', (node) => {
      if (node.tagName && ['SCRIPT', 'OBJECT', 'EMBED'].includes(node.tagName)) {
        log.securityAlert('Blocked potentially malicious element', { 
          tagName: node.tagName,
          innerHTML: node.innerHTML?.substring(0, 100)
        });
      }
    });
  }

  sanitizeHtml(dirty: string, options: SanitizationOptions = {}): string {
    const config = {
      ALLOWED_TAGS: options.allowedTags || [
        'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'
      ],
      ALLOWED_ATTR: options.allowedAttributes || ['class', 'id'],
      REMOVE_DATA_TYPE_IF_EMPTY: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    };

    const clean = this.purify.sanitize(dirty, config);
    
    if (dirty !== clean) {
      log.securityAlert('Content was sanitized', { 
        originalLength: dirty.length,
        cleanLength: clean.length 
      });
    }

    return clean;
  }

  sanitizeText(input: string): string {
    return this.purify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
}

// Validation avec Zod
export class InputValidator {
  // Schémas de validation communs
  static readonly emailSchema = z.string().email('Format email invalide');
  
  static readonly phoneSchema = z.string().regex(
    /^(\+213|0)[1-9]\d{8}$/,
    'Numéro de téléphone algérien invalide'
  );

  static readonly passwordSchema = z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial');

  static readonly legalReferenceSchema = z.string().regex(
    /^(Article|Art\.?)\s+\d+(-\d+)?\s+(du|de\s+la)\s+.+$/i,
    'Référence juridique invalide'
  );

  static validateInput<T>(input: unknown, schema: z.ZodSchema<T>): {
    success: boolean;
    data?: T;
    errors?: string[];
  } {
    try {
      const result = schema.parse(input);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => e.message);
        log.warn('Input validation failed', { errors, input: typeof input });
        return { success: false, errors };
      }
      
      log.error('Unexpected validation error', error);
      return { success: false, errors: ['Erreur de validation inattendue'] };
    }
  }

  static createCustomValidator<T>(
    schema: z.ZodSchema<T>,
    customErrorMessage?: string
  ): (input: unknown) => { success: boolean; data?: T; error?: string } {
    return (input: unknown) => {
      const result = this.validateInput(input, schema);
      return {
        success: result.success,
        data: result.data,
        error: result.success ? undefined : (customErrorMessage || result.errors?.[0])
      };
    };
  }
}

// Protection CSRF
export class CSRFProtection {
  private static tokenKey = 'csrf_token';
  private static tokenExpiry = 'csrf_token_expiry';

  static generateToken(): string {
    const token = crypto.randomUUID();
    const expiry = Date.now() + (60 * 60 * 1000); // 1 heure
    
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.tokenExpiry, expiry.toString());
    
    log.debug('CSRF token generated');
    return token;
  }

  static getToken(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    const expiry = sessionStorage.getItem(this.tokenExpiry);
    
    if (!token || !expiry) return null;
    
    if (Date.now() > parseInt(expiry)) {
      this.clearToken();
      return null;
    }
    
    return token;
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    const isValid = storedToken === token;
    
    if (!isValid) {
      log.securityAlert('CSRF token validation failed', { providedToken: token });
    }
    
    return isValid;
  }

  static clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenExpiry);
  }
}

// Rate Limiting côté client
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();

  static checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Nettoyer les anciennes requêtes
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      log.securityAlert('Rate limit exceeded', { key, requestCount: validRequests.length });
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  static clearRequests(key: string): void {
    this.requests.delete(key);
  }
}

// Utilitaires de chiffrement côté client
export class ClientEncryption {
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static generateSecureId(): string {
    return crypto.randomUUID();
  }

  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Classe principale de sécurité
export class SecurityManager {
  private config: SecurityConfig;
  private xssProtection: XSSProtection;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
    this.xssProtection = XSSProtection.getInstance();
  }

  // Sanitisation sécurisée pour les entrées utilisateur
  sanitizeUserInput(input: string, type: 'text' | 'html' = 'text'): string {
    if (!this.config.enableXSSProtection) return input;

    return type === 'html' 
      ? this.xssProtection.sanitizeHtml(input)
      : this.xssProtection.sanitizeText(input);
  }

  // Validation et sanitisation combinées
  validateAndSanitize<T>(
    input: unknown,
    schema: z.ZodSchema<T>,
    sanitizeType: 'text' | 'html' = 'text'
  ): { success: boolean; data?: T; error?: string } {
    // D'abord sanitiser si c'est une chaîne
    let sanitizedInput = input;
    if (typeof input === 'string') {
      sanitizedInput = this.sanitizeUserInput(input, sanitizeType);
    }

    // Puis valider
    const validation = InputValidator.validateInput(sanitizedInput, schema);
    
    return {
      success: validation.success,
      data: validation.data,
      error: validation.errors?.[0]
    };
  }

  // Vérification des permissions
  checkPermission(userRole: string, requiredPermission: string): boolean {
    const rolePermissions = {
      'admin': ['read', 'write', 'delete', 'manage_users', 'manage_system'],
      'moderator': ['read', 'write', 'moderate'],
      'user': ['read', 'write_own'],
      'guest': ['read']
    };

    const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];
    const hasPermission = permissions.includes(requiredPermission);

    if (!hasPermission) {
      log.securityAlert('Permission denied', { userRole, requiredPermission });
    }

    return hasPermission;
  }
}

// Instance globale
export const securityManager = new SecurityManager();

// Exports des utilitaires
export { XSSProtection, InputValidator, CSRFProtection, RateLimiter, ClientEncryption };
