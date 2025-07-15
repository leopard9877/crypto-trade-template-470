import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, FileText } from 'lucide-react';
import { useProcedureForm } from './ProcedureFormProvider';

export const Step2Requirements: React.FC = () => {
  const { state, updateField } = useProcedureForm();
  const { formData } = state;

  const addRequirement = () => {
    const currentRequirements = formData.requirements || [];
    updateField('requirements', [...currentRequirements, '']);
  };

  const updateRequirement = (index: number, value: string) => {
    const currentRequirements = [...(formData.requirements || [])];
    currentRequirements[index] = value;
    updateField('requirements', currentRequirements);
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = [...(formData.requirements || [])];
    currentRequirements.splice(index, 1);
    updateField('requirements', currentRequirements);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations sur la procédure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedDuration">Durée estimée</Label>
              <Input
                id="estimatedDuration"
                value={formData.estimatedDuration || ''}
                onChange={(e) => updateField('estimatedDuration', e.target.value)}
                placeholder="ex: 15 jours ouvrables"
              />
            </div>
            
            <div>
              <Label htmlFor="cost">Coût (DA)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost || ''}
                onChange={(e) => updateField('cost', Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="responsibleOrganization">Organisation responsable</Label>
            <Input
              id="responsibleOrganization"
              value={formData.responsibleOrganization || ''}
              onChange={(e) => updateField('responsibleOrganization', e.target.value)}
              placeholder="ex: Mairie de la commune"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prérequis et documents requis</span>
            <Button
              type="button"
              onClick={addRequirement}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un prérequis
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(!formData.requirements || formData.requirements.length === 0) ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun prérequis ajouté</p>
              <p className="text-sm">Cliquez sur "Ajouter un prérequis" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Prérequis ${index + 1}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Requirements Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Prérequis fréquents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Carte d\'identité nationale',
              'Acte de naissance',
              'Justificatif de domicile',
              'Certificat de résidence',
              'Extrait de casier judiciaire',
              'Attestation de travail',
              'Fiche familiale d\'état civil',
              'Photos d\'identité'
            ].map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentRequirements = formData.requirements || [];
                  if (!currentRequirements.includes(suggestion)) {
                    updateField('requirements', [...currentRequirements, suggestion]);
                  }
                }}
                className="justify-start text-left h-auto p-2"
              >
                <Plus className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};