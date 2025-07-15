import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ProcedureFormProvider, useProcedureForm } from './ProcedureFormProvider';
import { Step1GeneralInfo } from './Step1GeneralInfo';
import { Step2Requirements } from './Step2Requirements';
import { Step3ProcessSteps } from './Step3ProcessSteps';
import { Step4Review } from './Step4Review';

interface RefactoredProcedureFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const FormContent: React.FC = () => {
  const { state, nextStep, prevStep, validateForm, submitForm } = useProcedureForm();
  const { currentStep, isSubmitting } = state;

  const steps = [
    { id: 1, title: 'Informations générales', component: Step1GeneralInfo },
    { id: 2, title: 'Prérequis', component: Step2Requirements },
    { id: 3, title: 'Étapes du processus', component: Step3ProcessSteps },
    { id: 4, title: 'Révision', component: Step4Review },
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      // Form submitted successfully
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Nouvelle Procédure Administrative
          </h2>
          <span className="text-sm text-gray-500">
            Étape {currentStep} sur {steps.length}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentStepData?.title}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`
                  ml-2 text-sm font-medium whitespace-nowrap
                  ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {CurrentStepComponent && <CurrentStepComponent />}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>

        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Créer la procédure
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const RefactoredProcedureForm: React.FC<RefactoredProcedureFormProps> = ({
  onClose,
  onSubmit,
}) => {
  return (
    <ProcedureFormProvider onSubmit={onSubmit}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">Formulaire de Procédure</h1>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>
            <FormContent />
          </div>
        </div>
      </div>
    </ProcedureFormProvider>
  );
};