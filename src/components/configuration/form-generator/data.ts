import { 
  Type,
  FileText,
  Hash,
  Calendar,
  Mail,
  Phone,
  MapPin,
  List,
  ToggleLeft,
  Upload
} from "lucide-react";
import { FormTemplate, FieldType } from "./types";

// Données des types de textes juridiques prédéfinies dans l'onglet "Types de textes"
export const legalTypes: FormTemplate[] = [
  { value: "constitution", label: "Constitution", code: "CON", fields: ["titre", "numero", "date_promulgation", "journal_officiel", "contenu", "domaine_juridique", "status", "auteur", "organisation"] },
  { value: "accord_international", label: "Accord International", code: "ACI", fields: ["titre", "numero", "date_signature", "parties", "contenu", "domaine", "ratification", "organisation"] },
  { value: "convention_internationale", label: "Convention Internationale", code: "CVI", fields: ["titre", "numero", "date_signature", "parties", "contenu", "domaine", "ratification", "organisation"] },
  { value: "code", label: "Code", code: "COD", fields: ["titre", "type_code", "derniere_modification", "livre", "titre_livre", "chapitre", "section", "article", "organisation"] },
  { value: "loi_organique", label: "Loi Organique", code: "LOR", fields: ["titre", "numero", "date_promulgation", "journal_officiel", "contenu", "domaine_juridique", "organisation"] },
  { value: "loi", label: "Loi", code: "LOI", fields: ["titre", "numero", "date_promulgation", "journal_officiel", "contenu", "domaine_juridique", "status", "auteur", "organisation"] },
  { value: "ordonnance", label: "Ordonnance", code: "ORD", fields: ["titre", "numero", "date_signature", "president", "contexte", "domaine", "ratification", "effet", "organisation"] },
  { value: "decret_legislatif", label: "Décret Législatif", code: "DLG", fields: ["titre", "numero", "date_signature", "signataire", "contenu", "texte_reference", "organisation"] },
  { value: "decret_presidentiel", label: "Décret Présidentiel", code: "DPR", fields: ["titre", "numero", "date_signature", "signataire", "contenu", "texte_reference", "organisation"] },
  { value: "decret_executif", label: "Décret Exécutif", code: "DEC", fields: ["titre", "numero", "date_signature", "signataire", "contenu", "texte_reference", "ministere", "application", "organisation"] },
  { value: "arrete", label: "Arrêté", code: "ARR", fields: ["titre", "numero", "ministere", "date_signature", "objet", "application", "abrogation", "publication", "organisation"] },
  { value: "arrete_interministerielle", label: "Arrêté interministérielle", code: "AIM", fields: ["titre", "numero", "ministeres", "date_signature", "objet", "application", "organisation"] },
  { value: "arrete_ministerielle", label: "Arrêté ministérielle", code: "ARM", fields: ["titre", "numero", "ministere", "date_signature", "objet", "application", "organisation"] },
  { value: "decision", label: "Décision", code: "DEC", fields: ["titre", "numero", "autorite", "date_signature", "objet", "beneficiaire", "organisation"] },
  { value: "decision_interministerielle", label: "Décision interministérielle", code: "DIM", fields: ["titre", "numero", "ministeres", "date_signature", "objet", "organisation"] }
];

// Données des catégories de procédures prédéfinies dans l'onglet "Catégorie Procédures"  
export const procedureCategories: FormTemplate[] = [
  { value: "etat_civil", label: "État Civil", code: "ETI", fields: ["nom_procedure", "documents_requis", "delai_traitement", "cout", "lieu_depot", "conditions", "pieces_jointes", "observations", "organisation"] },
  { value: "urbanisme", label: "Urbanisme", code: "URB", fields: ["type_permis", "surface", "localisation", "documents_techniques", "frais", "commission", "zone", "contraintes", "organisation"] },
  { value: "commerce", label: "Commerce", code: "COM", fields: ["forme_juridique", "capital_social", "activite", "associes", "siege_social", "duree", "immatriculation", "taxes", "organisation"] },
  { value: "emploi", label: "Emploi", code: "EMP", fields: ["type_demande", "qualifications", "experience", "formation", "salaire_souhaite", "disponibilite", "organisation"] },
  { value: "sante", label: "Santé", code: "SAN", fields: ["type_service", "carte_assurance", "medecin_traitant", "specialite", "urgence", "rendez_vous", "organisation"] },
  { value: "education", label: "Éducation", code: "EDU", fields: ["niveau_etude", "etablissement", "diplome", "notes", "inscription", "annee_scolaire", "organisation"] },
  { value: "transport", label: "Transport", code: "TRA", fields: ["type_permis", "categorie_vehicule", "examen_medical", "formation", "cout_total", "validite", "restrictions", "renouvellement", "organisation"] },
  { value: "fiscalite", label: "Fiscalité", code: "FIS", fields: ["type_declaration", "periode_fiscale", "revenus", "charges", "impots", "penalites", "organisation"] }
];

export const formLists = {
  textes_juridiques: legalTypes,
  procedures_administratives: procedureCategories
};

export const formTypes = [
  { value: "textes_juridiques", label: "Textes Juridiques" },
  { value: "procedures_administratives", label: "Procédures Administratives" }
];

export const fieldTypes: FieldType[] = [
  { value: "text", label: "Texte", icon: Type },
  { value: "textarea", label: "Zone de texte", icon: FileText },
  { value: "number", label: "Nombre", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
  { value: "email", label: "Email", icon: Mail },
  { value: "tel", label: "Téléphone", icon: Phone },
  { value: "url", label: "URL", icon: MapPin },
  { value: "select", label: "Liste déroulante", icon: List },
  { value: "checkbox", label: "Case à cocher", icon: ToggleLeft },
  { value: "file", label: "Fichier", icon: Upload }
];

// Données des organisations depuis l'onglet "Organisation"
export const organizationOptions = [
  "Ministère de la santé et de la population",
  "Assemblée Populaire Nationale", 
  "Autorité Nationale Indépendante des Elections",
  "Banque d'Algérie",
  "Conseil Constitutionnel",
  "Conseil d'État",
  "Cour Suprême",
  "Ministère de l'intérieur et des collectivités locales",
  "Ministère de l'Education Nationale",
  "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
  "Ministère de la Justice",
  "Ministère des Finances",
  "Ministère du Commerce",
  "Ministère du Travail, de l'Emploi et de la Sécurité Sociale",
  "Ministère de l'Agriculture et du développement rural",
  "Ministère de l'Habitat et de l'Urbanisme",
  "Ministère des Transports",
  "Ministère de la Défense Nationale",
  "Ministère des Affaires Etrangères",
  "Présidence de la république"
];