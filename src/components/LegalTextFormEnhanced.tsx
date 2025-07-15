
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LegalTextFormHeader } from './legal/LegalTextFormHeader';
import { LegalTextFormInputMethodSelector } from './legal/LegalTextFormInputMethodSelector';
import { LegalTextFormOCRSection } from './legal/LegalTextFormOCRSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Save, ArrowLeft, Wand2 } from 'lucide-react';
import { getLegalTextTemplate, ALL_LEGAL_TEXT_TEMPLATES } from '@/data/legalTextTemplates';
import { LegalTextDynamicFieldRenderer } from './legal/LegalTextDynamicFieldRenderer';

interface LegalTextFormEnhancedProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialOCRText?: string;
  initialInputMethod?: 'manual' | 'ocr';
}

export function LegalTextFormEnhanced({ 
  onClose, 
  onSubmit, 
  initialOCRText,
  initialInputMethod = 'manual'
}: LegalTextFormEnhancedProps) {
  const { toast } = useToast();
  const [inputMethod, setInputMethod] = useState<'manual' | 'ocr'>(initialInputMethod);
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const [selectedTextType, setSelectedTextType] = useState<string>('');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialOCRText) {
      import('@/utils/ocrFormFiller').then(({ extractLegalTextData }) => {
        const extractedData = extractLegalTextData(initialOCRText);
        console.log('Pré-remplissage avec OCR:', extractedData);
        setFormData(extractedData);
      }).catch(() => {
        setFormData({ content: initialOCRText });
      });
    }
  }, [initialOCRText]);

  const handleOCRTextExtracted = (extractedText: string) => {
    import('@/utils/ocrFormFiller').then(({ extractLegalTextData }) => {
      const extractedData = extractLegalTextData(extractedText);
      console.log('Données extraites par OCR:', extractedData);
      setFormData(extractedData);
    }).catch(() => {
      setFormData({ content: extractedText });
    });
    setShowOCRScanner(false);
    setInputMethod('manual');
  };

  const handleAutoFill = () => {
    const event = new CustomEvent('open-ai-autofill', {
      detail: { context: 'legal-text' }
    });
    window.dispatchEvent(event);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, textType: selectedTextType };
    console.log('Données finales du formulaire:', finalData);
    onSubmit(finalData);
    toast({
      title: "Texte juridique ajouté",
      description: `Le texte juridique "${selectedTextType}" a été ajouté avec succès.`,
    });
  };

  const selectedTemplate = selectedTextType ? getLegalTextTemplate(selectedTextType) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onClose} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-emerald-600" />
                Ajout d'un Texte Juridique Algérien
              </h1>
              <p className="text-gray-600 mt-1">Saisie complète d'un texte juridique avec formulaire adapté</p>
            </div>
          </div>
          <Button onClick={handleAutoFill} variant="outline" className="gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100">
            <Wand2 className="w-4 h-4 text-purple-600" />
            Auto-remplissage IA
          </Button>
        </div>
        
        <LegalTextFormInputMethodSelector 
          inputMethod={inputMethod}
          onInputMethodChange={setInputMethod}
        />

        {inputMethod === 'ocr' && (
          <LegalTextFormOCRSection
            showOCRScanner={showOCRScanner}
            onShowOCRScanner={setShowOCRScanner}
            onOCRTextExtracted={handleOCRTextExtracted}
          />
        )}

        {inputMethod === 'manual' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sélection du type de texte juridique */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Type de Texte Juridique
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="text-type" className="text-sm font-medium text-gray-700">
                    Sélectionnez le type de texte juridique *
                  </Label>
                  <Select value={selectedTextType} onValueChange={setSelectedTextType}>
                    <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                      <SelectValue placeholder="Choisir un type de texte juridique" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_LEGAL_TEXT_TEMPLATES.map((template) => (
                        <SelectItem key={template.type} value={template.type}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire dynamique adapté au type */}
            {selectedTemplate && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                  <CardTitle className="text-xl text-gray-900">
                    Formulaire : {selectedTemplate.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Remplissez les champs spécifiques à ce type de texte juridique
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedTemplate.fields.map((field) => (
                      <div 
                        key={field.name} 
                        className={field.type === 'textarea' || field.type === 'dynamic-list' ? 'md:col-span-2' : ''}
                      >
                        <LegalTextDynamicFieldRenderer
                          field={field}
                          value={formData[field.name]}
                          onChange={(value) => handleFieldChange(field.name, value)}
                          formData={formData}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="px-8">
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="px-8 bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={!selectedTextType}
              >
                <Save className="w-4 h-4" />
                Enregistrer le texte juridique
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
