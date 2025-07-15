/**
 * Hook personnalisé pour gérer la logique du formulaire de procédure
 */

import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { log } from '@/utils/logger';
import { ProcedureFormData, FormErrors, OCRExtractedData } from '../ProcedureFormTypes';

interface UseProcedureFormOptions {
  initialData?: Partial<ProcedureFormData>;
  onSubmit: (data: ProcedureFormData) => void;
  mode?: 'create' | 'edit' | 'view';
}

export const useProcedureForm = ({
  initialData = {},
  onSubmit,
  mode = 'create'
}: UseProcedureFormOptions) => {
  const { toast } = useToast();
  const [data, setData] = useState<Partial<ProcedureFormData>>({
    title: '',
    description: '',
    category: '',
    institution: '',
    difficulty: 'medium',
    duration: '',
    cost: '',
    requiredDocuments: [],
    steps: [],
    dynamicFields: [],
    tags: [],
    isPublic: true,
    allowComments: true,
    attachments: [],
    ...initialData
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showOCR, setShowOCR] = useState(false);

  // Validation des données
  const errors = useMemo((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.title?.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (data.title.length < 10) {
      newErrors.title = 'Le titre doit contenir au moins 10 caractères';
    }

    if (!data.description?.trim()) {
      newErrors.description = 'La description est requise';
    } else if (data.description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    }

    if (!data.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!data.institution) {
      newErrors.institution = 'L\'institution est requise';
    }

    if (!data.difficulty) {
      newErrors.difficulty = 'Le niveau de difficulté est requis';
    }

    if (!data.duration) {
      newErrors.duration = 'La durée est requise';
    }

    if (!data.cost) {
      newErrors.cost = 'Le coût est requis';
    }

    return newErrors;
  }, [data]);

  // Vérification si le formulaire est valide
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Mise à jour des données
  const updateData = useCallback((updates: Partial<ProcedureFormData>) => {
    setData(prev => ({ ...prev, ...updates }));
    log.debug('Procedure form data updated', { updates });
  }, []);

  // Gestion de l'OCR
  const handleOCRData = useCallback((extractedData: OCRExtractedData) => {
    log.info('OCR data extracted', { confidence: extractedData.confidence });
    
    const updates: Partial<ProcedureFormData> = {};
    
    if (extractedData.title && !data.title) {
      updates.title = extractedData.title;
    }
    
    if (extractedData.description && !data.description) {
      updates.description = extractedData.description;
    }
    
    if (extractedData.institution && !data.institution) {
      updates.institution = extractedData.institution;
    }
    
    if (extractedData.requiredDocuments) {
      updates.requiredDocuments = [
        ...(data.requiredDocuments || []),
        ...extractedData.requiredDocuments
      ];
    }

    if (Object.keys(updates).length > 0) {
      updateData(updates);
      toast({
        title: 'Données OCR intégrées',
        description: 'Les informations extraites ont été ajoutées au formulaire',
      });
    }

    setShowOCR(false);
  }, [data, updateData, toast]);

  // Sauvegarde
  const handleSave = useCallback(async () => {
    if (!isValid) {
      toast({
        title: 'Formulaire invalide',
        description: 'Veuillez corriger les erreurs avant de sauvegarder',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      log.audit('procedure_form_submit', { 
        mode, 
        title: data.title,
        category: data.category 
      });
      
      await onSubmit(data as ProcedureFormData);
      
      toast({
        title: mode === 'create' ? 'Procédure créée' : 'Procédure mise à jour',
        description: 'Les modifications ont été sauvegardées avec succès',
      });
    } catch (error) {
      log.error('Error saving procedure form', error);
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [data, isValid, mode, onSubmit, toast]);

  // Navigation entre les étapes
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    log.debug('Form step changed', { step });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  return {
    // État
    data,
    currentStep,
    isSaving,
    showOCR,
    errors,
    isValid,
    
    // Actions
    updateData,
    handleSave,
    handleOCRData,
    goToStep,
    nextStep,
    previousStep,
    setShowOCR,
    
    // Utilitaires
    canProceed: isValid,
    totalSteps: 4, // Ajustez selon le nombre d'étapes
  };
};