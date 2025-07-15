/**
 * Formulaire de procédure refactorisé - Version modulaire et maintenable
 * Remplace le ProcedureForm.tsx original (782 lignes) par une approche composée
 */

import React from 'react';
import { ProcedureFormHeader } from './ProcedureFormHeader';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { CharacteristicsStep } from './steps/CharacteristicsStep';
import { OCRScanner } from '@/components/common/OCRScanner';
import { useProcedureForm } from './hooks/useProcedureForm';
import { ProcedureFormProps } from './ProcedureFormTypes';

export const ProcedureFormRefactored: React.FC<ProcedureFormProps> = ({
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}) => {
  const {
    data,
    currentStep,
    isSaving,
    showOCR,
    errors,
    isValid,
    updateData,
    handleSave,
    handleOCRData,
    goToStep,
    nextStep,
    previousStep,
    setShowOCR,
    totalSteps
  } = useProcedureForm({
    initialData,
    onSubmit,
    mode
  });

  const renderCurrentStep = () => {
    const stepProps = {
      data,
      onChange: updateData,
      errors,
      isValid
    };

    switch (currentStep) {
      case 0:
        return <BasicInfoStep {...stepProps} />;
      case 1:
        return <CharacteristicsStep {...stepProps} />;
      // case 2:
      //   return <DocumentsStep {...stepProps} />;
      // case 3:
      //   return <StepsConfigurationStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  const getStepTitle = (step: number) => {
    const titles = [
      'Informations de base',
      'Caractéristiques',
      'Documents requis',
      'Étapes de la procédure'
    ];
    return titles[step] || 'Étape inconnue';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du formulaire */}
      <ProcedureFormHeader
        mode={mode}
        title={data.title || ''}
        isValid={isValid}
        isSaving={isSaving}
        showOCRButton={!showOCR}
        onClose={onClose}
        onSave={handleSave}
        onOCRScan={() => setShowOCR(true)}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Scanner OCR */}
        {showOCR && (
          <div className="mb-8">
            <OCRScanner
              onTextExtracted={handleOCRData}
              onClose={() => setShowOCR(false)}
            />
          </div>
        )}

        {/* Navigation des étapes */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
              {Array.from({ length: totalSteps }, (_, index) => (
                <li key={index} className="relative md:flex-1 md:flex">
                  <div
                    className={`group flex items-center w-full cursor-pointer ${
                      index <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                    onClick={() => goToStep(index)}
                  >
                    <span className="px-6 py-4 flex items-center text-sm font-medium">
                      <span
                        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                          index < currentStep
                            ? 'bg-indigo-600 text-white'
                            : index === currentStep
                            ? 'border-2 border-indigo-600 text-indigo-600'
                            : 'border-2 border-gray-300 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="ml-4 text-sm font-medium">
                        {getStepTitle(index)}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Contenu de l'étape actuelle */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation des étapes */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={previousStep}
            disabled={currentStep === 0}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentStep === 0
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Précédent
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                !isValid || isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSaving ? 'Enregistrement...' : 'Finaliser'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};