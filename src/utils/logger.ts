/**
 * Système de logging sécurisé pour l'application de veille juridique
 * Remplace les console.log pour éviter les fuites d'informations en production
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
}

class Logger {
  private isProduction = import.meta.env.PROD;
  private logLevel = this.isProduction ? LogLevel.ERROR : LogLevel.DEBUG;
  private maxLogs = 100;
  private logs: LogEntry[] = [];

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data: this.sanitizeData(data),
    };
  }

  private sanitizeData(data: any): any {
    if (this.isProduction) {
      // En production, on ne log que les structures, pas les données sensibles
      if (typeof data === 'object' && data !== null) {
        return Object.keys(data).reduce((acc, key) => {
          acc[key] = typeof data[key];
          return acc;
        }, {} as any);
      }
      return typeof data;
    }
    return data;
  }

  private persistLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // En développement, on utilise console
    if (!this.isProduction) {
      const logMethod = this.getConsoleMethod(entry.level);
      logMethod(`[${entry.context || 'APP'}] ${entry.message}`, entry.data);
    }
  }

  private getConsoleMethod(level: LogLevel): Console['log'] {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  debug(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.persistLog(this.createLogEntry(LogLevel.DEBUG, message, context, data));
    }
  }

  info(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.persistLog(this.createLogEntry(LogLevel.INFO, message, context, data));
    }
  }

  warn(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.persistLog(this.createLogEntry(LogLevel.WARN, message, context, data));
    }
  }

  error(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.persistLog(this.createLogEntry(LogLevel.ERROR, message, context, data));
    }
  }

  // Méthodes utilitaires pour l'audit et le debugging
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Méthode spécialisée pour les actions utilisateur (audit)
  auditAction(action: string, userId?: string, details?: any): void {
    this.info(`User action: ${action}`, 'AUDIT', {
      userId: userId || 'anonymous',
      action,
      details: this.sanitizeData(details),
    });
  }

  // Méthode pour les erreurs de sécurité
  securityAlert(message: string, details?: any): void {
    this.error(`SECURITY ALERT: ${message}`, 'SECURITY', details);
    
    // En production, on pourrait envoyer à un service de monitoring
    if (this.isProduction) {
      // TODO: Intégrer avec un service de monitoring (Sentry, etc.)
    }
  }
}

// Instance singleton
export const logger = new Logger();

// Utilitaires pour remplacer facilement les console.log existants
export const log = {
  debug: (message: string, data?: any) => logger.debug(message, 'APP', data),
  info: (message: string, data?: any) => logger.info(message, 'APP', data),
  warn: (message: string, data?: any) => logger.warn(message, 'APP', data),
  error: (message: string, data?: any) => logger.error(message, 'APP', data),
  audit: (action: string, details?: any) => logger.auditAction(action, undefined, details),
};