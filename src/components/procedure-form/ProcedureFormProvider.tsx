import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { procedureSchema, Procedure } from '@/schemas/securitySchemas';
import { z } from 'zod';

interface ProcedureFormState {
  currentStep: number;
  formData: Partial<Procedure>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  touchedFields: Set<string>;
  isValid: boolean;
}

type ProcedureFormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'TOUCH_FIELD'; payload: string }
  | { type: 'RESET_FORM' }
  | { type: 'VALIDATE_FORM' };

const initialState: ProcedureFormState = {
  currentStep: 1,
  formData: {
    steps: [],
    requirements: [],
  },
  errors: {},
  isSubmitting: false,
  touchedFields: new Set(),
  isValid: false,
};

const formReducer = (state: ProcedureFormState, action: ProcedureFormAction): ProcedureFormState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_FIELD': {
      const newFormData = { ...state.formData, [action.payload.field]: action.payload.value };
      const newTouchedFields = new Set(state.touchedFields);
      newTouchedFields.add(action.payload.field);
      
      return {
        ...state,
        formData: newFormData,
        touchedFields: newTouchedFields,
      };
    }
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'TOUCH_FIELD': {
      const newTouchedFields = new Set(state.touchedFields);
      newTouchedFields.add(action.payload);
      return { ...state, touchedFields: newTouchedFields };
    }
    
    case 'RESET_FORM':
      return initialState;
    
    case 'VALIDATE_FORM': {
      try {
        procedureSchema.parse(state.formData);
        return { ...state, isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            errors[path] = err.message;
          });
          return { ...state, isValid: false, errors };
        }
        return { ...state, isValid: false };
      }
    }
    
    default:
      return state;
  }
};

interface ProcedureFormContextType {
  state: ProcedureFormState;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: (field: string, value: any) => void;
  touchField: (field: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
}

const ProcedureFormContext = createContext<ProcedureFormContextType | null>(null);

interface ProcedureFormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: Procedure) => Promise<void>;
}

export const ProcedureFormProvider: React.FC<ProcedureFormProviderProps> = ({ 
  children, 
  onSubmit 
}) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const nextStep = useCallback(() => {
    if (state.currentStep < 4) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const updateField = useCallback((field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  }, []);

  const touchField = useCallback((field: string) => {
    dispatch({ type: 'TOUCH_FIELD', payload: field });
  }, []);

  const validateForm = useCallback((): boolean => {
    dispatch({ type: 'VALIDATE_FORM' });
    try {
      procedureSchema.parse(state.formData);
      return true;
    } catch {
      return false;
    }
  }, [state.formData]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const submitForm = useCallback(async (): Promise<boolean> => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    
    try {
      const validatedData = procedureSchema.parse(state.formData);
      await onSubmit(validatedData);
      dispatch({ type: 'RESET_FORM' });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        dispatch({ type: 'SET_ERRORS', payload: errors });
      }
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [state.formData, onSubmit]);

  const contextValue: ProcedureFormContextType = {
    state,
    goToStep,
    nextStep,
    prevStep,
    updateField,
    touchField,
    validateForm,
    resetForm,
    submitForm,
  };

  return (
    <ProcedureFormContext.Provider value={contextValue}>
      {children}
    </ProcedureFormContext.Provider>
  );
};

export const useProcedureForm = (): ProcedureFormContextType => {
  const context = useContext(ProcedureFormContext);
  if (!context) {
    throw new Error('useProcedureForm must be used within a ProcedureFormProvider');
  }
  return context;
};