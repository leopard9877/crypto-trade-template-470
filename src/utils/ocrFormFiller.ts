
interface LegalTextFormData {
  title?: string;
  type?: string;
  category?: string;
  authority?: string;
  reference?: string;
  publicationDate?: string;
  description?: string;
  language?: string;
}

interface ProcedureFormData {
  name?: string;
  type?: string;
  description?: string;
  sector?: string;
  reference?: string;
}

export function extractLegalTextData(ocrText: string): Partial<LegalTextFormData> {
  const data: Partial<LegalTextFormData> = {};
  
  // Recherche de patterns spécifiques aux textes juridiques algériens
  const patterns = {
    // Loi, Décret, Ordonnance
    type: /\b(Loi|Décret|Ordonnance|Arrêté)\b/i,
    // Numéro de référence
    reference: /n°?\s*(\d{1,3}[-\/]\d{1,3})/g,
    // Date
    date: /\b(\d{1,2}[\s\/\-]\d{1,2}[\s\/\-]\d{4})\b/g,
    // Autorités
    authority: /(Président|Gouvernement|Ministre|Ministère)/i,
    // Langue
    language: /\b(العربية|français|arabe)\b/i
  };

  // Extraction du type
  const typeMatch = ocrText.match(patterns.type);
  if (typeMatch) {
    const type = typeMatch[0].toLowerCase();
    if (type.includes('loi')) data.type = 'Loi';
    else if (type.includes('décret')) data.type = 'Décret exécutif';
    else if (type.includes('ordonnance')) data.type = 'Ordonnance';
    else if (type.includes('arrêté')) data.type = 'Arrêté ministériel';
  }

  // Extraction de la référence
  const refMatches = ocrText.match(patterns.reference);
  if (refMatches && refMatches.length > 0) {
    data.reference = refMatches[0];
  }

  // Extraction de la date
  const dateMatches = ocrText.match(patterns.date);
  if (dateMatches && dateMatches.length > 0) {
    const dateStr = dateMatches[0];
    // Essayer de parser et formater la date
    try {
      const date = new Date(dateStr.replace(/[\s\/]/g, '-'));
      if (!isNaN(date.getTime())) {
        data.publicationDate = date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.warn('Date parsing failed:', dateStr);
    }
  }

  // Extraction de l'autorité
  const authorityMatch = ocrText.match(patterns.authority);
  if (authorityMatch) {
    const auth = authorityMatch[0].toLowerCase();
    if (auth.includes('président')) data.authority = 'Présidence de la République';
    else if (auth.includes('gouvernement')) data.authority = 'Gouvernement';
    else if (auth.includes('ministre')) data.authority = 'Ministère de la Justice';
  }

  // Extraction du titre (première ligne significative)
  const lines = ocrText.split('\n').filter(line => line.trim().length > 10);
  if (lines.length > 0) {
    data.title = lines[0].trim();
  }

  // Description (texte complet nettoyé)
  data.description = ocrText.trim();

  // Détection de la langue
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const frenchRegex = /[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/;
  
  if (arabicRegex.test(ocrText) && frenchRegex.test(ocrText)) {
    data.language = 'ar-fr';
  } else if (arabicRegex.test(ocrText)) {
    data.language = 'ar';
  } else {
    data.language = 'fr';
  }

  return data;
}

export function extractProcedureData(ocrText: string): Partial<ProcedureFormData> {
  const data: Partial<ProcedureFormData> = {};
  
  // Patterns pour les procédures administratives
  const patterns = {
    // Types de procédures
    type: /\b(demande|autorisation|licence|permis|certificat|déclaration)\b/i,
    // Secteurs
    sector: /(commerce|industrie|agriculture|transport|urbanisme|éducation)/i,
    // Référence
    reference: /(dossier|n°|ref)\s*:?\s*(\w+)/i
  };

  // Extraction du type
  const typeMatch = ocrText.match(patterns.type);
  if (typeMatch) {
    const type = typeMatch[0].toLowerCase();
    if (type.includes('demande')) data.type = 'Demande';
    else if (type.includes('autorisation')) data.type = 'Autorisation';
    else if (type.includes('licence')) data.type = 'Licence';
    else if (type.includes('permis')) data.type = 'Permis';
    else if (type.includes('certificat')) data.type = 'Certificat';
    else if (type.includes('déclaration')) data.type = 'Déclaration';
  }

  // Extraction du secteur
  const sectorMatch = ocrText.match(patterns.sector);
  if (sectorMatch) {
    const sector = sectorMatch[0].toLowerCase();
    if (sector.includes('commerce')) data.sector = 'Commerce';
    else if (sector.includes('industrie')) data.sector = 'Industrie';
    else if (sector.includes('agriculture')) data.sector = 'Agriculture';
    else if (sector.includes('transport')) data.sector = 'Transport';
    else if (sector.includes('urbanisme')) data.sector = 'Urbanisme et Construction';
    else if (sector.includes('éducation')) data.sector = 'Éducation';
  }

  // Extraction du nom (première ligne significative)
  const lines = ocrText.split('\n').filter(line => line.trim().length > 5);
  if (lines.length > 0) {
    data.name = lines[0].trim();
  }

  // Description
  data.description = ocrText.trim();

  return data;
}
