import { z } from 'zod';

// Base validation schemas
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial');

export const emailSchema = z
  .string()
  .email('Format d\'email invalide')
  .refine((email) => {
    // Additional security checks
    const suspiciousPatterns = [
      /\+.*\+/, // Multiple + signs
      /\.{2,}/, // Multiple consecutive dots
      /@.*@/, // Multiple @ signs
      /[<>]/, // HTML injection attempts
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, 'Format d\'email suspect détecté');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide');

// Sanitization functions
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeHtml = (input: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// User input schemas
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .transform(sanitizeString),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .transform(sanitizeString),
  organization: z.string()
    .max(100, 'Le nom de l\'organisation ne peut pas dépasser 100 caractères')
    .transform(sanitizeString)
    .optional(),
  phone: phoneSchema.optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional(),
});

// Legal content schemas
export const legalTextSchema = z.object({
  title: z.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .transform(sanitizeString),
  content: z.string()
    .min(50, 'Le contenu doit contenir au moins 50 caractères')
    .max(50000, 'Le contenu ne peut pas dépasser 50 000 caractères')
    .transform(sanitizeHtml),
  category: z.enum([
    'constitution',
    'loi',
    'decret',
    'arrete',
    'circulaire',
    'instruction',
    'jurisprudence',
    'autre'
  ]),
  jurisdiction: z.string().transform(sanitizeString),
  publicationDate: z.date(),
  effectiveDate: z.date().optional(),
  tags: z.array(z.string().transform(sanitizeString)).max(20, 'Maximum 20 tags'),
  isActive: z.boolean().default(true),
});

export const procedureSchema = z.object({
  name: z.string()
    .min(5, 'Le nom doit contenir au moins 5 caractères')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères')
    .transform(sanitizeString),
  description: z.string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .transform(sanitizeHtml),
  steps: z.array(z.object({
    title: z.string().transform(sanitizeString),
    description: z.string().transform(sanitizeHtml),
    required: z.boolean(),
    documents: z.array(z.string()).optional(),
  })).min(1, 'Au moins une étape est requise'),
  estimatedDuration: z.string().transform(sanitizeString),
  cost: z.number().min(0, 'Le coût ne peut pas être négatif').optional(),
  requirements: z.array(z.string().transform(sanitizeString)),
  responsibleOrganization: z.string().transform(sanitizeString),
});

// File upload schemas
export const fileUploadSchema = z.object({
  name: z.string()
    .min(1, 'Le nom du fichier est requis')
    .refine((name) => {
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png'];
      return allowedExtensions.some(ext => name.toLowerCase().endsWith(ext));
    }, 'Type de fichier non autorisé'),
  size: z.number()
    .max(10 * 1024 * 1024, 'La taille du fichier ne peut pas dépasser 10 MB'),
  type: z.string().refine((type) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    return allowedTypes.includes(type);
  }, 'Type MIME non autorisé'),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string()
    .max(500, 'La requête ne peut pas dépasser 500 caractères')
    .transform(sanitizeString),
  filters: z.object({
    category: z.array(z.string()).optional(),
    dateRange: z.object({
      start: z.date().optional(),
      end: z.date().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
  sortBy: z.enum(['relevance', 'date', 'title']).default('relevance'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Rate limiting schema
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000), // Minimum 1 second
  maxRequests: z.number().min(1),
  identifier: z.string(), // IP address or user ID
});

// Audit log schema
export const auditLogSchema = z.object({
  userId: z.string().optional(),
  action: z.string().transform(sanitizeString),
  resource: z.string().transform(sanitizeString),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().ip(),
  userAgent: z.string().transform(sanitizeString),
  timestamp: z.date().default(new Date()),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
});

// Export all schemas
export const securitySchemas = {
  userRegistration: userRegistrationSchema,
  login: loginSchema,
  legalText: legalTextSchema,
  procedure: procedureSchema,
  fileUpload: fileUploadSchema,
  search: searchSchema,
  rateLimit: rateLimitSchema,
  auditLog: auditLogSchema,
  password: passwordSchema,
  email: emailSchema,
  phone: phoneSchema,
};

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type Login = z.infer<typeof loginSchema>;
export type LegalText = z.infer<typeof legalTextSchema>;
export type Procedure = z.infer<typeof procedureSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type Search = z.infer<typeof searchSchema>;
export type RateLimit = z.infer<typeof rateLimitSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;