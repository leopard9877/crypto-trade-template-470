import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';
import { useProcedureForm } from './ProcedureFormProvider';

interface ProcedureStep {
  title: string;
  description: string;
  required: boolean;
  documents?: string[];
}

export const Step3ProcessSteps: React.FC = () => {
  const { state, updateField } = useProcedureForm();
  const { formData } = state;
  const steps = formData.steps || [];

  const addStep = () => {
    const newStep: ProcedureStep = {
      title: '',
      description: '',
      required: true,
      documents: []
    };
    updateField('steps', [...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof ProcedureStep, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    updateField('steps', updatedSteps);
  };

  const removeStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    updateField('steps', updatedSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const updatedSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < updatedSteps.length) {
      [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
      updateField('steps', updatedSteps);
    }
  };

  const addDocument = (stepIndex: number) => {
    const updatedSteps = [...steps];
    const currentDocuments = updatedSteps[stepIndex].documents || [];
    updatedSteps[stepIndex].documents = [...currentDocuments, ''];
    updateField('steps', updatedSteps);
  };

  const updateDocument = (stepIndex: number, docIndex: number, value: string) => {
    const updatedSteps = [...steps];
    const currentDocuments = [...(updatedSteps[stepIndex].documents || [])];
    currentDocuments[docIndex] = value;
    updatedSteps[stepIndex].documents = currentDocuments;
    updateField('steps', updatedSteps);
  };

  const removeDocument = (stepIndex: number, docIndex: number) => {
    const updatedSteps = [...steps];
    const currentDocuments = [...(updatedSteps[stepIndex].documents || [])];
    currentDocuments.splice(docIndex, 1);
    updatedSteps[stepIndex].documents = currentDocuments;
    updateField('steps', updatedSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Étapes du processus</h3>
          <p className="text-sm text-gray-600">Définissez les étapes nécessaires pour compléter cette procédure</p>
        </div>
        <Button onClick={addStep} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une étape
        </Button>
      </div>

      {steps.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ListOrdered className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune étape définie</h3>
            <p className="text-gray-600 mb-4">Commencez par ajouter la première étape de votre procédure</p>
            <Button onClick={addStep} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter la première étape
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {steps.map((step, stepIndex) => (
            <Card key={stepIndex} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      Étape {stepIndex + 1}
                    </span>
                    {step.required && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        Obligatoire
                      </span>
                    )}
                  </CardTitle>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveStep(stepIndex, 'up')}
                      disabled={stepIndex === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveStep(stepIndex, 'down')}
                      disabled={stepIndex === steps.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(stepIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`step-title-${stepIndex}`}>Titre de l'étape</Label>
                  <Input
                    id={`step-title-${stepIndex}`}
                    value={step.title}
                    onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                    placeholder="ex: Dépôt du dossier"
                  />
                </div>

                <div>
                  <Label htmlFor={`step-description-${stepIndex}`}>Description</Label>
                  <Textarea
                    id={`step-description-${stepIndex}`}
                    value={step.description}
                    onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                    placeholder="Décrivez en détail cette étape..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`step-required-${stepIndex}`}
                    checked={step.required}
                    onCheckedChange={(checked) => updateStep(stepIndex, 'required', checked)}
                  />
                  <Label htmlFor={`step-required-${stepIndex}`}>Cette étape est obligatoire</Label>
                </div>

                {/* Documents pour cette étape */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label>Documents requis pour cette étape</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addDocument(stepIndex)}
                      className="gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {(step.documents || []).map((document, docIndex) => (
                      <div key={docIndex} className="flex gap-2">
                        <Input
                          value={document}
                          onChange={(e) => updateDocument(stepIndex, docIndex, e.target.value)}
                          placeholder="Nom du document requis"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDocument(stepIndex, docIndex)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};