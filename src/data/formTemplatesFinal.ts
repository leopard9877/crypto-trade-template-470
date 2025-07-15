import { FormTemplate } from './formTemplates';

export const FINAL_FORM_TEMPLATES: FormTemplate[] = [
  // Déclaration
  {
    id: 'declaration',
    name: 'Déclaration',
    type: 'Déclaration',
    category: 'Communications Officielles',
    description: 'Formulaire pour les déclarations officielles',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'journal_numero', label: 'Journal N°', type: 'text', required: true },
      { name: 'date_journal', label: 'Date du Journal', type: 'date', required: true },
      { name: 'numero_page', label: 'N° de Page', type: 'number', required: true },
      { name: 'numero_ref', label: 'N° Réf', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'titre', label: 'Titre', type: 'text', required: true },
      { name: 'contenu', label: 'Contenu', type: 'textarea', required: true },
      { name: 'date_signature', label: 'Date de signature', type: 'date', required: true },
      { name: 'piece_jointe', label: 'Pièce Jointe', type: 'file', required: false }
    ]
  },

  // Bulletin d'information
  {
    id: 'bulletin_information',
    name: 'Bulletin d\'information',
    type: 'Bulletin',
    category: 'Publications',
    description: 'Formulaire pour les bulletins d\'information',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'numero_ref', label: 'N° Réf', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'titre', label: 'Titre', type: 'text', required: true },
      { name: 'sous_titre', label: 'Sous-Titre', type: 'text', required: false },
      { name: 'introduction', label: 'Introduction', type: 'textarea', required: true },
      { name: 'corps', label: 'Corps (Information détaillée)', type: 'textarea', required: true },
      { name: 'conclusion', label: 'Conclusion', type: 'textarea', required: false },
      { name: 'piece_jointe', label: 'Pièce Jointe', type: 'file', required: false }
    ]
  },

  // Jurisprudence
  {
    id: 'jurisprudence',
    name: 'Jurisprudence',
    type: 'Jurisprudence',
    category: 'Décisions Judiciaires',
    description: 'Formulaire pour les décisions de jurisprudence',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'numero_jurisprudence', label: 'N° de Jurisprudence', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'structure_concernee', label: 'Structure concernée', type: 'text', required: true },
      { name: 'sujet', label: 'Sujet', type: 'text', required: true },
      { name: 'piece_jointe', label: 'Pièce Jointe', type: 'file', required: false }
    ]
  },

  // Cahier de charge
  {
    id: 'cahier_charge',
    name: 'Cahier de charge',
    type: 'Cahier des charges',
    category: 'Documents Contractuels',
    description: 'Formulaire pour les cahiers des charges',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'titre_document', label: 'Titre du document', type: 'text', required: true },
      { name: 'nom_projet', label: 'Nom du projet', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'parties_prenantes', label: 'Nom des parties prenantes', type: 'textarea', required: true },
      { name: 'reference_document', label: 'Référence du document', type: 'text', required: true },
      { name: 'table_matieres', label: 'Table des matières', type: 'textarea', required: true },
      { name: 'contexte_projet', label: 'Contexte du projet', type: 'textarea', required: true },
      { name: 'objectifs', label: 'Objectifs', type: 'textarea', required: true },
      { name: 'cadre_legal', label: 'Cadre légal (loi)', type: 'text', required: false },
      { name: 'identification_parties', label: 'Identification des parties', type: 'textarea', required: true },
      { name: 'coordonnees', label: 'Coordonnées', type: 'textarea', required: true },
      { name: 'mission', label: 'La mission', type: 'textarea', required: true },
      { name: 'perimetre_intervention', label: 'Périmètre d\'intervention', type: 'textarea', required: true },
      { name: 'documents_attendus', label: 'Les documents attendus', type: 'textarea', required: true },
      { name: 'exigences_techniques', label: 'Exigences techniques et méthodologique', type: 'textarea', required: true },
      { name: 'duree_calendrier', label: 'Durée et calendrier', type: 'textarea', required: true },
      { name: 'condition_financiere', label: 'Condition financière', type: 'textarea', required: true },
      { name: 'confidentialite', label: 'Confidentialité', type: 'textarea', required: false },
      { name: 'obligation_commanditaire', label: 'Obligation commanditaire', type: 'textarea', required: true },
      { name: 'obligation_prestataire', label: 'Obligation Prestataire', type: 'textarea', required: true },
      { name: 'signature_parties', label: 'Signature des parties', type: 'text', required: true },
      { name: 'piece_jointe', label: 'Pièce Jointe', type: 'file', required: false }
    ]
  },

  // Cahier des clauses administratives générales
  {
    id: 'ccag',
    name: 'Cahier des clauses administratives générales',
    type: 'CCAG',
    category: 'Documents Contractuels',
    description: 'Formulaire pour les cahiers des clauses administratives générales',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'ref', label: 'Réf', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'objet', label: 'Objet (nature du marché)', type: 'select', required: true,
        options: ['Travaux', 'Marchés industriels', 'Prestations intellectuelles', 'Fournitures courantes et prestations de services', 'Techniques de l\'information et de la communication', 'Marchés de maîtrise d\'œuvre'] },
      { name: 'champ_application', label: 'Champ d\'application', type: 'textarea', required: true },
      { name: 'obligation_titulaire', label: 'Obligation titulaire', type: 'textarea', required: true },
      { name: 'modalite_paiement', label: 'Modalité de paiement', type: 'textarea', required: true },
      { name: 'delais_execution', label: 'Délais d\'exécution', type: 'textarea', required: true },
      { name: 'reception_prestations', label: 'Réception des prestations (vérification et test)', type: 'textarea', required: true },
      { name: 'garantit', label: 'Garantit', type: 'textarea', required: true },
      { name: 'maintenance', label: 'Maintenance', type: 'textarea', required: false },
      { name: 'resiliation', label: 'Résiliation', type: 'textarea', required: true },
      { name: 'reglement_litiges', label: 'Règlement des litiges', type: 'textarea', required: true },
      { name: 'signature', label: 'Signature', type: 'text', required: true }
    ]
  },

  // Discours
  {
    id: 'discours',
    name: 'Discours',
    type: 'Discours',
    category: 'Communications Officielles',
    description: 'Formulaire pour les discours officiels',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'introduction', label: 'Introduction', type: 'textarea', required: true },
      { name: 'developpement', label: 'Développement', type: 'textarea', required: true },
      { name: 'conclusion', label: 'Conclusion', type: 'textarea', required: true },
      { name: 'piece_jointe', label: 'Pièce Jointe', type: 'file', required: false }
    ]
  },

  // Rapport
  {
    id: 'rapport',
    name: 'Rapport',
    type: 'Rapport',
    category: 'Documents Techniques',
    description: 'Formulaire pour les rapports officiels',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'titre', label: 'Titre', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'nom_signataire', label: 'Nom du signataire', type: 'text', required: true },
      { name: 'table_matiere', label: 'Table de matière', type: 'textarea', required: true },
      { name: 'introduction', label: 'Introduction (Information générale)', type: 'textarea', required: true },
      { name: 'developpement', label: 'Développement (Avec les différentes sections)', type: 'textarea', required: true },
      { name: 'conclusion', label: 'Conclusion', type: 'textarea', required: true },
      { name: 'signature', label: 'Signature (Uniquement pour le rapport)', type: 'text', required: true },
      { name: 'piece_jointes', label: 'Pièce jointes', type: 'file', required: false }
    ]
  },

  // Guide
  {
    id: 'guide',
    name: 'Guide',
    type: 'Guide',
    category: 'Documents Techniques',
    description: 'Formulaire pour les guides pratiques',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'titre', label: 'Titre', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'nom_signataire', label: 'Nom du signataire', type: 'text', required: true },
      { name: 'table_matiere', label: 'Table de matière', type: 'textarea', required: true },
      { name: 'introduction', label: 'Introduction (Information générale)', type: 'textarea', required: true },
      { name: 'developpement', label: 'Développement (Avec les différentes sections)', type: 'textarea', required: true },
      { name: 'conclusion', label: 'Conclusion', type: 'textarea', required: true },
      { name: 'signature', label: 'Signature (Uniquement pour le rapport)', type: 'text', required: true },
      { name: 'piece_jointes', label: 'Pièce jointes', type: 'file', required: false }
    ]
  },

  // Plan d'action
  {
    id: 'plan_action',
    name: 'Plan d\'action',
    type: 'Plan',
    category: 'Planification',
    description: 'Formulaire pour les plans d\'action',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'contexte', label: 'Contexte', type: 'textarea', required: true },
      { name: 'objectif', label: 'Objectif', type: 'textarea', required: true },
      { name: 'etat_actuel', label: 'État actuel', type: 'textarea', required: true },
      { name: 'ressources_disponibles', label: 'Ressources disponibles', type: 'textarea', required: true },
      { name: 'action_entreprendre', label: 'Action à entreprendre', type: 'textarea', required: true },
      { name: 'affectation_roles', label: 'Affectation des rôles', type: 'textarea', required: true },
      { name: 'definition_planning', label: 'Définition du planning', type: 'textarea', required: true },
      { name: 'budgets', label: 'Budgets', type: 'textarea', required: true },
      { name: 'ressources_humaines', label: 'Ressources humaines', type: 'textarea', required: true },
      { name: 'ressources_materielles', label: 'Ressources matérielles', type: 'textarea', required: true },
      { name: 'suivi_evaluation', label: 'Suivi et Évaluation', type: 'textarea', required: true },
      { name: 'conclusion', label: 'Conclusion', type: 'textarea', required: true },
      { name: 'piece_jointe', label: 'Pièce Jointe', type: 'file', required: false }
    ]
  },

  // Barème
  {
    id: 'bareme',
    name: 'Barème',
    type: 'Barème',
    category: 'Évaluation',
    description: 'Formulaire pour les barèmes d\'évaluation',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'contexte', label: 'Contexte', type: 'textarea', required: true },
      { name: 'instructions', label: 'Instructions', type: 'textarea', required: true },
      { name: 'critere_evaluation', label: 'Critère d\'évaluation', type: 'textarea', required: true },
      { name: 'point_attribues', label: 'Point attribués', type: 'textarea', required: true },
      { name: 'commentaire', label: 'Commentaire', type: 'textarea', required: false },
      { name: 'total', label: 'Total', type: 'number', required: true },
      { name: 'signature', label: 'Signature', type: 'text', required: true }
    ]
  },

  // Norme
  {
    id: 'norme',
    name: 'Norme',
    type: 'Norme',
    category: 'Standards',
    description: 'Formulaire pour les normes techniques',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'contexte', label: 'Contexte', type: 'textarea', required: true },
      { name: 'instructions', label: 'Instructions', type: 'textarea', required: true },
      { name: 'critere_evaluation', label: 'Critère d\'évaluation', type: 'textarea', required: true },
      { name: 'point_attribues', label: 'Point attribués', type: 'textarea', required: true },
      { name: 'commentaire', label: 'Commentaire', type: 'textarea', required: false },
      { name: 'total', label: 'Total', type: 'number', required: true },
      { name: 'signature', label: 'Signature', type: 'text', required: true }
    ]
  },

  // Procès-verbal
  {
    id: 'proces_verbal',
    name: 'Procès-verbal',
    type: 'Procès-verbal',
    category: 'Comptes-rendus',
    description: 'Formulaire pour les procès-verbaux de réunion',
    createdAt: '2024-01-01',
    isSystem: true,
    fields: [
      { name: 'titre', label: 'Titre', type: 'text', required: true },
      { name: 'date_heure', label: 'Date et heure', type: 'text', required: true },
      { name: 'lieu', label: 'Lieu', type: 'text', required: true },
      { name: 'participants_present', label: 'Participants présents', type: 'textarea', required: true },
      { name: 'absent', label: 'Absents', type: 'textarea', required: false },
      { name: 'president_seance', label: 'Président de séance', type: 'text', required: true },
      { name: 'secretaire_seance', label: 'Secrétaire de séance', type: 'text', required: true },
      { name: 'ordre_jours', label: 'Ordre du jour (les points à discuter)', type: 'textarea', required: true },
      { name: 'deroulement_reunion', label: 'Déroulement de la réunion (et intervention des participants)', type: 'textarea', required: true },
      { name: 'questions_diverses', label: 'Questions diverses', type: 'textarea', required: false },
      { name: 'decision', label: 'Décision', type: 'textarea', required: true },
      { name: 'cloture_reunion', label: 'Clôture de réunion', type: 'textarea', required: true },
      { name: 'signature', label: 'Signature', type: 'text', required: true },
      { name: 'piece_jointe', label: 'Pièce jointe', type: 'file', required: false }
    ]
  }
];

// Combiner tous les templates
import { FORM_TEMPLATES } from './formTemplates';
import { EXTENDED_FORM_TEMPLATES } from './formTemplatesExtended';
import { ADDITIONAL_FORM_TEMPLATES } from './formTemplatesAdditional';

export const ALL_FORM_TEMPLATES: FormTemplate[] = [
  ...FORM_TEMPLATES,
  ...EXTENDED_FORM_TEMPLATES,
  ...ADDITIONAL_FORM_TEMPLATES,
  ...FINAL_FORM_TEMPLATES
];