import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { FormLibrary } from "@/components/forms/FormLibrary";

// Composants refactorisés
import { GenerationMethodSelector } from "./form-generator/GenerationMethodSelector";
import { FormConfiguration } from "./form-generator/FormConfiguration";
import { OCRConfiguration } from "./form-generator/OCRConfiguration";
import { FieldEditor } from "./form-generator/FieldEditor";
import { FormPreview } from "./form-generator/FormPreview";

// Types et utilitaires
import { FormField } from "./form-generator/types";
import { formLists } from "./form-generator/data";
import { parseTextToFormFields, generateFormFields } from "./form-generator/utils";

export function FormGeneratorTab() {
  const [selectedFormType, setSelectedFormType] = useState("");
  const [selectedFormList, setSelectedFormList] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [generatedFields, setGeneratedFields] = useState<FormField[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const [generationMethod, setGenerationMethod] = useState<'manual' | 'ocr'>('manual');

  const handleGenerateForm = () => {
    const fields = generateFormFields(selectedFormType, selectedFormList, formLists);
    setGeneratedFields(fields);
  };

  const handleOCRTextExtracted = (extractedText: string) => {
    const generatedFieldsFromOCR = parseTextToFormFields(extractedText);
    setGeneratedFields(generatedFieldsFromOCR);
    setShowOCRScanner(false);
  };

  const addCustomField = () => {
    const newField: FormField = {
      id: `custom_${Date.now()}`,
      name: 'nouveau_champ',
      label: 'Nouveau Champ',
      type: 'text',
      required: false,
      placeholder: 'Entrez votre valeur'
    };
    setGeneratedFields([...generatedFields, newField]);
    setEditingField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setGeneratedFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (fieldId: string) => {
    setGeneratedFields(fields => fields.filter(field => field.id !== fieldId));
  };

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = generatedFields.find(field => field.id === fieldId);
    if (fieldToDuplicate) {
      const newField: FormField = {
        ...fieldToDuplicate,
        id: `copy_${Date.now()}`,
        name: `${fieldToDuplicate.name}_copie`,
        label: `${fieldToDuplicate.label} (Copie)`
      };
      setGeneratedFields([...generatedFields, newField]);
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = generatedFields.findIndex(field => field.id === fieldId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= generatedFields.length) return;
    
    const newFields = [...generatedFields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
    setGeneratedFields(newFields);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-600" />
          Générateur de Formulaires Avancé
        </h3>
        <p className="text-gray-600">
          Créez, personnalisez et exportez des formulaires sophistiqués pour chaque type de contenu
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Générateur</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Méthode de génération */}
          <GenerationMethodSelector
            generationMethod={generationMethod}
            onMethodChange={setGenerationMethod}
          />

          {/* Configuration manuelle */}
          {generationMethod === 'manual' && (
            <FormConfiguration
              selectedFormType={selectedFormType}
              selectedFormList={selectedFormList}
              formDescription={formDescription}
              onFormTypeChange={setSelectedFormType}
              onFormListChange={setSelectedFormList}
              onDescriptionChange={setFormDescription}
              onGenerate={handleGenerateForm}
            />
          )}

          {/* Configuration OCR */}
          {generationMethod === 'ocr' && (
            <OCRConfiguration
              showOCRScanner={showOCRScanner}
              onShowOCRScanner={setShowOCRScanner}
              onTextExtracted={handleOCRTextExtracted}
            />
          )}

          {/* Éditeur de champs */}
          <FieldEditor
            fields={generatedFields}
            editingField={editingField}
            generationMethod={generationMethod}
            onAddField={addCustomField}
            onUpdateField={updateField}
            onRemoveField={removeField}
            onDuplicateField={duplicateField}
            onMoveField={moveField}
            onEditField={setEditingField}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <FormPreview
            fields={generatedFields}
            formDescription={formDescription}
          />
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <FormLibrary onSelectTemplate={(template) => {
            // Vous pouvez implémenter la logique pour utiliser le template sélectionné
            console.log('Template sélectionné:', template);
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}