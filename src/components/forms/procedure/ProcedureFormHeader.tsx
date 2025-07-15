/**
 * Composant Header du formulaire de procédure
 * Gère la barre de titre et les actions principales
 */

import React from 'react';
import { ArrowLeft, Save, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcedureFormHeaderProps {
  mode: 'create' | 'edit' | 'view';
  title: string;
  isValid: boolean;
  isSaving: boolean;
  showOCRButton: boolean;
  onClose: () => void;
  onSave: () => void;
  onOCRScan: () => void;
}

export const ProcedureFormHeader: React.FC<ProcedureFormHeaderProps> = ({
  mode,
  title,
  isValid,
  isSaving,
  showOCRButton,
  onClose,
  onSave,
  onOCRScan
}) => {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Créer une nouvelle procédure';
      case 'edit':
        return `Modifier: ${title || 'Procédure'}`;
      case 'view':
        return `Consulter: ${title || 'Procédure'}`;
      default:
        return 'Procédure';
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          
          <div className="border-l border-gray-300 h-6" />
          
          <h1 className="text-xl font-semibold text-gray-900">
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {showOCRButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOCRScan}
              className="flex items-center space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Scanner OCR</span>
            </Button>
          )}

          {mode !== 'view' && (
            <Button
              onClick={onSave}
              disabled={!isValid || isSaving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};