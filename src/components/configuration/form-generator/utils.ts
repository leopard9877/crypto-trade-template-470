import { FormField } from "./types";
import { organizationOptions } from "./data";

export const getFieldType = (fieldName: string) => {
  if (fieldName.includes('date')) return 'date';
  if (fieldName.includes('numero') || fieldName.includes('cout') || fieldName.includes('capital')) return 'number';
  if (fieldName.includes('contenu') || fieldName.includes('description') || fieldName.includes('observations')) return 'textarea';
  if (fieldName.includes('email')) return 'email';
  if (fieldName.includes('tel') || fieldName.includes('phone')) return 'tel';
  if (fieldName.includes('url') || fieldName.includes('site')) return 'url';
  if (fieldName === 'organisation') return 'select'; // Champ organisation doit être une liste déroulante
  if (fieldName.includes('ministere') || fieldName.includes('ministeres')) return 'select';
  return 'text';
};

export const isRequiredField = (fieldName: string) => {
  const requiredFields = ['titre', 'nom_procedure', 'numero', 'date'];
  return requiredFields.some(req => fieldName.includes(req));
};

export const getFieldDescription = (fieldName: string) => {
  const descriptions: { [key: string]: string } = {
    'titre': 'Titre officiel du document',
    'numero': 'Numéro d\'identification unique',
    'date_promulgation': 'Date de promulgation officielle',
    'date_signature': 'Date de signature du document',
    'journal_officiel': 'Référence du Journal Officiel',
    'contenu': 'Contenu complet du texte',
    'domaine_juridique': 'Domaine juridique concerné',
    'organisation': 'Organisation responsable (selon l\'onglet Organisation)',
    'signataire': 'Personne ou autorité signataire',
    'ministere': 'Ministère concerné',
    'ministeres': 'Ministères concernés (si plusieurs)',
    'autorite': 'Autorité responsable',
    'nom_procedure': 'Nom de la procédure administrative',
    'documents_requis': 'Liste des documents nécessaires',
    'delai_traitement': 'Délai de traitement estimé',
    'cout': 'Coût de la procédure en DA',
    'lieu_depot': 'Lieu de dépôt de la demande',
    'conditions': 'Conditions requises pour la procédure',
    'pieces_jointes': 'Pièces jointes nécessaires',
    'observations': 'Observations et remarques importantes',
    'type_permis': 'Type de permis demandé',
    'surface': 'Surface concernée',
    'localisation': 'Localisation du projet',
    'documents_techniques': 'Documents techniques requis',
    'frais': 'Frais de la procédure',
    'commission': 'Commission d\'examen',
    'zone': 'Zone géographique concernée',
    'contraintes': 'Contraintes et restrictions'
  };
  return descriptions[fieldName] || `Information relative à ${fieldName.replace(/_/g, ' ')}`;
};

export const parseTextToFormFields = (text: string): FormField[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const fields: FormField[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 0) {
      // Détecter les types de champs basés sur le contenu
      let fieldType = 'text';
      let fieldName = trimmedLine.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      if (trimmedLine.toLowerCase().includes('date')) fieldType = 'date';
      else if (trimmedLine.toLowerCase().includes('email')) fieldType = 'email';
      else if (trimmedLine.toLowerCase().includes('téléphone') || trimmedLine.toLowerCase().includes('tel')) fieldType = 'tel';
      else if (trimmedLine.toLowerCase().includes('nombre') || /\d+/.test(trimmedLine)) fieldType = 'number';
      else if (trimmedLine.length > 50) fieldType = 'textarea';
      
      fields.push({
        id: `ocr_field_${index}`,
        name: fieldName,
        label: trimmedLine,
        type: fieldType,
        required: false,
        placeholder: `Saisir ${trimmedLine.toLowerCase()}`,
        description: `Champ généré à partir du texte: "${trimmedLine}"`
      });
    }
  });
  
  return fields;
};

export const generateFormFields = (selectedFormType: string, selectedFormList: string, formLists: any): FormField[] => {
  const selectedType = selectedFormType as keyof typeof formLists;
  const selectedForm = formLists[selectedType]?.find((form: any) => form.value === selectedFormList);
  
  if (selectedForm) {
    const fields: FormField[] = selectedForm.fields.map((field: string, index: number) => {
      const fieldType = getFieldType(field);
      let options: string[] | undefined;
      
      // Ajouter les options pour les champs de type select
      if (field === 'organisation') {
        options = organizationOptions;
      } else if (field === 'ministere' || field === 'ministeres') {
        options = organizationOptions.filter(org => org.includes('Ministère'));
      }
      
      return {
        id: `field_${index}`,
        name: field,
        label: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: fieldType,
        required: isRequiredField(field),
        placeholder: fieldType === 'select' ? `Sélectionner ${field.replace(/_/g, ' ').toLowerCase()}` : `Saisir ${field.replace(/_/g, ' ').toLowerCase()}`,
        description: getFieldDescription(field),
        options: options
      };
    });
    return fields;
  }
  return [];
};