/**
 * Types TypeScript pour le formulaire de procédure administrative
 * Remplace les utilisations de 'any' pour une meilleure sécurité de type
 */

import { FormFieldData } from '@/types/common';

export interface ProcedureFormData {
  // Informations générales
  title: string;
  description: string;
  category: string;
  institution: string;
  
  // Caractéristiques
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: string;
  cost: string;
  
  // Documentation
  requiredDocuments: string[];
  steps: ProcedureFormStep[];
  dynamicFields: ProcedureFormField[];
  
  // Métadonnées
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  
  // Fichiers
  attachments: File[];
}

export interface ProcedureFormStep {
  id: string;
  order: number;
  title: string;
  description: string;
  isOptional: boolean;
  estimatedTime: number;
  requiredDocuments: string[];
  tips: string[];
}

export interface ProcedureFormField extends FormFieldData {
  category: 'personal' | 'document' | 'payment' | 'other';
  dependsOn?: string[];
  computedValue?: string;
}

export interface ProcedureFormProps {
  onClose: () => void;
  onSubmit: (data: ProcedureFormData) => void;
  initialData?: Partial<ProcedureFormData>;
  mode?: 'create' | 'edit' | 'view';
}

export interface FormStepProps {
  data: Partial<ProcedureFormData>;
  onChange: (updates: Partial<ProcedureFormData>) => void;
  errors: FormErrors;
  isValid: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface OCRExtractedData {
  title?: string;
  description?: string;
  institution?: string;
  requiredDocuments?: string[];
  steps?: Partial<ProcedureFormStep>[];
  extractedText?: string;
  confidence?: number;
}

// Constantes pour les options
export const PROCEDURE_CATEGORIES = [
  'Urbanisme',
  'État civil',
  'Fiscalité',
  'Commerce',
  'Social',
  'Santé',
  'Éducation',
  'Transport',
  'Environnement',
  'Agriculture'
] as const;

export const ORGANIZATIONS = [
  'Ministère de l\'Intérieur',
  'Ministère des Finances',
  'Ministère de la Justice',
  'Ministère de la Santé',
  'Ministère de l\'Éducation',
  'Ministère du Commerce',
  'Ministère de l\'Agriculture',
  'Ministère des Transports',
  'Wilaya',
  'Commune',
  'Direction des Impôts',
  'Tribunal',
  'Office National des Statistiques'
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Facile', color: 'green' },
  { value: 'medium', label: 'Moyen', color: 'yellow' },
  { value: 'hard', label: 'Difficile', color: 'orange' },
  { value: 'expert', label: 'Expert', color: 'red' }
] as const;

export const DURATION_OPTIONS = [
  '1 jour',
  '2-3 jours',
  '1 semaine',
  '2 semaines',
  '1 mois',
  '2-3 mois',
  'Plus de 3 mois'
] as const;

export const COST_RANGES = [
  'Gratuit',
  'Moins de 1000 DZD',
  '1000-5000 DZD',
  '5000-10000 DZD',
  '10000-50000 DZD',
  'Plus de 50000 DZD'
] as const;