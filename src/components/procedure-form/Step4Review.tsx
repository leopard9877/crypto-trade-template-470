import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  Building, 
  CheckCircle, 
  AlertCircle,
  ListOrdered
} from 'lucide-react';
import { useProcedureForm } from './ProcedureFormProvider';

export const Step4Review: React.FC = () => {
  const { state } = useProcedureForm();
  const { formData, errors } = state;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      {/* Status */}
      <Card className={hasErrors ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            {hasErrors ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            <div>
              <h3 className={`font-semibold ${hasErrors ? 'text-red-900' : 'text-green-900'}`}>
                {hasErrors ? 'Formulaire incomplet' : 'Formulaire prêt à être soumis'}
              </h3>
              <p className={`text-sm ${hasErrors ? 'text-red-700' : 'text-green-700'}`}>
                {hasErrors 
                  ? 'Veuillez corriger les erreurs avant de continuer'
                  : 'Toutes les informations requises ont été fournies'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {hasErrors && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Erreurs à corriger</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{field}:</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Nom de la procédure</h4>
              <p className="text-gray-700">{formData.name || 'Non spécifié'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Organisation responsable</h4>
              <p className="text-gray-700">{formData.responsibleOrganization || 'Non spécifié'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-1">Description</h4>
            <p className="text-gray-700">{formData.description || 'Aucune description fournie'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-900">Durée estimée:</span>
                <span className="ml-2 text-gray-700">{formData.estimatedDuration || 'Non spécifié'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-900">Coût:</span>
                <span className="ml-2 text-gray-700">
                  {formData.cost ? `${formData.cost} DA` : 'Gratuit'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Prérequis et documents requis</CardTitle>
        </CardHeader>
        <CardContent>
          {!formData.requirements || formData.requirements.length === 0 ? (
            <p className="text-gray-500 italic">Aucun prérequis spécifié</p>
          ) : (
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5" />
            Étapes du processus ({formData.steps?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!formData.steps || formData.steps.length === 0 ? (
            <p className="text-gray-500 italic">Aucune étape définie</p>
          ) : (
            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Étape {index + 1}</Badge>
                    {step.required && (
                      <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-gray-700 text-sm">{step.description}</p>
                  
                  {step.documents && step.documents.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-800 mb-1">Documents requis:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {step.documents.map((document, docIndex) => (
                          <li key={docIndex}>{document}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {formData.requirements?.length || 0}
              </div>
              <div className="text-sm text-blue-700">Prérequis</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {formData.steps?.length || 0}
              </div>
              <div className="text-sm text-blue-700">Étapes</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {formData.estimatedDuration || '-'}
              </div>
              <div className="text-sm text-blue-700">Durée</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {formData.cost ? `${formData.cost} DA` : 'Gratuit'}
              </div>
              <div className="text-sm text-blue-700">Coût</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};