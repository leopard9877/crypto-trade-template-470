/**
 * Types communs pour l'application de veille juridique
 * Remplace les utilisations de 'any' pour une meilleure sécurité de type
 */

// Types de base pour les données utilisateur
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences?: UserPreferences;
  lastLogin?: string;
  isActive: boolean;
}

export interface UserPreferences {
  language: 'fr' | 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface DashboardSettings {
  widgets: string[];
  layout: 'grid' | 'list';
  refreshInterval: number;
}

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

// Types pour les procédures administratives
export interface ProcedureData {
  id: string;
  title: string;
  description: string;
  category: string;
  institution: string;
  status: ProcedureStatus;
  difficulty: DifficultyLevel;
  duration: string;
  cost: string;
  requiredDocuments: string[];
  steps: ProcedureStep[];
  forms: FormData[];
  tags: string[];
  rating: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type ProcedureStatus = 'draft' | 'published' | 'archived' | 'under_review';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface ProcedureStep {
  id: string;
  order: number;
  title: string;
  description: string;
  isOptional: boolean;
  estimatedTime: number;
  requiredDocuments: string[];
  tips?: string[];
}

// Types pour les textes juridiques
export interface LegalTextData {
  id: string;
  title: string;
  content: string;
  type: LegalTextType;
  category: string;
  domain: string;
  organization: string;
  signatory: string;
  publicationDate: string;
  effectiveDate: string;
  status: LegalTextStatus;
  reference: string;
  tags: string[];
  attachments: AttachmentData[];
  metadata: LegalTextMetadata;
}

export type LegalTextType = 'law' | 'decree' | 'regulation' | 'directive' | 'circular' | 'instruction';
export type LegalTextStatus = 'active' | 'abrogated' | 'modified' | 'suspended';

export interface LegalTextMetadata {
  source: string;
  officialGazette?: string;
  lastModified: string;
  relatedTexts: string[];
  keywords: string[];
}

export interface AttachmentData {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Types pour les formulaires
export interface FormFieldData {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: FieldOption[];
  validation?: ValidationRule[];
  conditional?: ConditionalRule;
}

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'number' 
  | 'tel' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'radio' 
  | 'checkbox' 
  | 'textarea' 
  | 'file';

export interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
}

export interface ConditionalRule {
  field: string;
  operator: '=' | '!=' | '>' | '<' | 'contains';
  value: string;
  action: 'show' | 'hide' | 'require';
}

// Types pour les recherches et filtres
export interface SearchParams {
  query: string;
  type: SearchType;
  filters: SearchFilter[];
  sortBy: SortOption;
  page: number;
  limit: number;
}

export type SearchType = 'all' | 'legal_texts' | 'procedures' | 'news' | 'documents';

export interface SearchFilter {
  field: string;
  operator: FilterOperator;
  value: string | string[];
}

export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'in' | 'dateRange';

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Types pour les résultats de recherche
export interface SearchResult<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Types pour les modales
export interface ModalConfig {
  title: string;
  size: ModalSize;
  closable: boolean;
  backdrop: boolean;
  keyboard: boolean;
  centered: boolean;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalData<T = unknown> {
  id: string;
  type: string;
  data: T;
  config: Partial<ModalConfig>;
}

// Types pour les alertes et notifications
export interface AlertData {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  category: string;
  severity: AlertSeverity;
  target: AlertTarget;
  conditions: AlertCondition[];
  schedule: AlertSchedule;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
}

export type AlertType = 'text_update' | 'procedure_change' | 'deadline' | 'system' | 'custom';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertTarget = 'all' | 'role' | 'user' | 'group';

export interface AlertCondition {
  field: string;
  operator: string;
  value: string;
}

export interface AlertSchedule {
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  time?: string;
  days?: number[];
}

// Types pour l'API et les erreurs
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  version: string;
}

// Types pour les événements et actions
export interface UserAction {
  type: string;
  timestamp: string;
  userId: string;
  data: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

// Types pour les configurations
export interface ConfigurationData {
  nomenclature: NomenclatureConfig;
  alerts: AlertConfig;
  security: SecurityConfig;
  ui: UIConfig;
}

export interface NomenclatureConfig {
  textTypes: string[];
  categories: string[];
  domains: string[];
  organizations: string[];
  signatories: string[];
}

export interface AlertConfig {
  channels: string[];
  templates: Record<string, string>;
  defaultSettings: NotificationSettings;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: PasswordPolicy;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export interface UIConfig {
  theme: string;
  defaultLanguage: string;
  availableLanguages: string[];
  dateFormat: string;
}

// Types utilitaires
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Types pour les événements personnalisés
export interface CustomEventDetail<T = unknown> {
  type: string;
  data: T;
  timestamp: string;
}

// Types exportés pour réutilisation dans d'autres modules