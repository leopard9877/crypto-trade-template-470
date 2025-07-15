
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Settings, Save, Wand2, ClipboardList, Scan, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OCRScanner } from '@/components/common/OCRScanner';
import { DynamicFieldList } from '@/components/procedure-form/DynamicFieldList';
import { DocumentField } from '@/components/procedure-form/DocumentField';
import { FileUploadField } from '@/components/procedure-form/FileUploadField';

interface ProcedureFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Nomenclature data - these would normally come from a database
const CATEGORIES = [
  'Urbanisme',
  'État civil',
  'Fiscalité',
  'Commerce',
  'Social',
  'Santé',
  'Éducation',
  'Transport',
  'Environnement',
  'Agriculture'
];

const ORGANIZATIONS = [
  'Ministère de l\'Intérieur',
  'Ministère des Finances',
  'Ministère de la Justice',
  'Ministère de la Santé',
  'Ministère de l\'Éducation',
  'Ministère du Commerce',
  'Ministère de l\'Agriculture',
  'Ministère des Transports',
  'Wilaya',
  'Commune',
  'Direction des Impôts',
  'Tribunal',
  'Office National des Statistiques'
];

export function ProcedureForm({ onClose, onSubmit }: ProcedureFormProps) {
  const { toast } = useToast();
  const [inputMethod, setInputMethod] = useState<'manual' | 'ocr'>('manual');
  const [showOCRScanner, setShowOCRScanner] = useState(false);

  // Listen for OCR tab activation events
  useEffect(() => {
    const handleActivateOCRTab = () => {
      setInputMethod('ocr');
    };

    window.addEventListener('activate-ocr-tab', handleActivateOCRTab);
    return () => {
      window.removeEventListener('activate-ocr-tab', handleActivateOCRTab);
    };
  }, []);

  const [formData, setFormData] = useState({
    // Informations de base
    name: '',
    description: '',
    procedureCategory: '',
    sectorAdministration: '',
    targetCategory: '',
    
    // Champs dynamiques
    steps: [''],
    conditions: [''],
    requiredDocuments: [''],
    requiredDocumentsType: 'text' as 'existing' | 'text',
    complementaryDocuments: [''],
    complementaryDocumentsType: 'text' as 'existing' | 'text',
    legalBasis: [''],
    
    // Modalités
    submissionLocation: '',
    validityType: 'periodic' as 'periodic' | 'open',
    validityStartDate: '',
    validityEndDate: '',
    processingDuration: '',
    feeType: 'gratuit' as 'gratuit' | 'payant',
    feeAmount: '',
    paymentMethods: '',
    
    // Numérisation
    digitization: false,
    digitizationDate: '',
    electronicPortalLink: '',
    mobileAppLink: '',
    thirdPartySubmission: false,
    
    // Retrait et validité
    withdrawalTime: '',
    withdrawalMethod: '',
    documentValidity: '',
    
    // Recours
    hasAppeal: false,
    appealLocation: '',
    appealDeadline: '',
    appealFees: '',
    
    // Fichiers
    userGuide: '',
    downloadableForm: '',
    
    // FAQ et contact
    faq: '',
    contactAddress: '',
    contactPhone: '',
    contactGreenNumber: '',
    contactEmail: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOCRTextExtracted = (extractedText: string) => {
    // Essayer d'extraire les données structurées, sinon utiliser le texte brut
    import('@/utils/ocrFormFiller').then(({ extractProcedureData }) => {
      const extractedData = extractProcedureData(extractedText);
      console.log('Données extraites par OCR:', extractedData);
      setFormData(prev => ({ ...prev, ...extractedData }));
    }).catch(() => {
      // Fallback simple si le module n'existe pas
      setFormData(prev => ({ ...prev, description: extractedText }));
    });
    setShowOCRScanner(false);
    setInputMethod('manual'); // Passer en mode manuel après extraction
  };

  const handleAutoFill = () => {
    // Ouvrir la modal d'auto-remplissage IA
    const event = new CustomEvent('open-ai-autofill', {
      detail: { context: 'procedure' }
    });
    window.dispatchEvent(event);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données de la procédure:', formData);
    onSubmit(formData);
    toast({
      title: "Procédure ajoutée",
      description: `La procédure "${formData.name || 'nouvelle procédure'}" a été ajoutée avec succès.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onClose} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                Ajouter une nouvelle procédure administrative
              </h1>
              <p className="text-gray-600 mt-1">Configuration complète d'une procédure administrative</p>
            </div>
          </div>
          <Button onClick={handleAutoFill} variant="outline" className="gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100">
            <Wand2 className="w-4 h-4 text-purple-600" />
            Auto-remplissage IA
          </Button>
        </div>

        {/* Méthode de saisie */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Méthode de Saisie
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant={inputMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setInputMethod('manual')}
                className="h-20 flex flex-col gap-2"
              >
                <ClipboardList className="w-6 h-6" />
                <span>Insertion Manuelle</span>
                <span className="text-xs opacity-80">Saisie via le formulaire</span>
              </Button>
              
              <Button
                type="button"
                variant={inputMethod === 'ocr' ? 'default' : 'outline'}
                onClick={() => setInputMethod('ocr')}
                className="h-20 flex flex-col gap-2"
              >
                <Scan className="w-6 h-6" />
                <span>Insertion OCR</span>
                <span className="text-xs opacity-80">Scan de document</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section OCR */}
        {inputMethod === 'ocr' && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-green-600" />
                Scanner pour Générer une Procédure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!showOCRScanner ? (
                <div className="text-center py-8">
                  <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Scanner un Document</h4>
                  <p className="text-gray-600 mb-4">
                    Utilisez l'OCR pour extraire automatiquement les informations de votre document de procédure
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button 
                      onClick={() => setShowOCRScanner(true)} 
                      className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col gap-1"
                    >
                      <FileImage className="w-5 h-5" />
                      <span>Importer un fichier</span>
                      <span className="text-xs opacity-80">Images ou PDF</span>
                    </Button>
                    <Button 
                      onClick={() => setShowOCRScanner(true)} 
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 h-16 flex flex-col gap-1"
                    >
                      <Scan className="w-5 h-5" />
                      <span>Prendre une photo</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <OCRScanner
                  onTextExtracted={handleOCRTextExtracted}
                  onClose={() => setShowOCRScanner(false)}
                  title="Scanner pour Générer une Procédure"
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Formulaire manuel */}
        {inputMethod === 'manual' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Informations générales */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom de la procédure *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nom de la procédure"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procedureCategory" className="text-sm font-medium text-gray-700">Catégorie de procédure *</Label>
                    <Select onValueChange={(value) => handleInputChange('procedureCategory', value)} value={formData.procedureCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description de la procédure"
                    rows={4}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sectorAdministration" className="text-sm font-medium text-gray-700">Secteur et/ou administration *</Label>
                    <Select onValueChange={(value) => handleInputChange('sectorAdministration', value)} value={formData.sectorAdministration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une organisation" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORGANIZATIONS.map((org) => (
                          <SelectItem key={org} value={org}>{org}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetCategory" className="text-sm font-medium text-gray-700">Catégorie Ciblée</Label>
                    <Select onValueChange={(value) => handleInputChange('targetCategory', value)} value={formData.targetCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la catégorie ciblée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citoyen">Citoyen</SelectItem>
                        <SelectItem value="administration">Administration</SelectItem>
                        <SelectItem value="entreprises">Entreprises</SelectItem>
                        <SelectItem value="investisseur">Investisseur</SelectItem>
                        <SelectItem value="associations">Associations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails de la procédure */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Détails de la procédure</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <DynamicFieldList
                  label="Étapes (avec démonstration si disponible)"
                  values={formData.steps}
                  onChange={(values) => handleInputChange('steps', values)}
                  placeholder="Décrire une étape de la procédure..."
                  type="textarea"
                />

                <DynamicFieldList
                  label="Conditions d'utilisation du service"
                  values={formData.conditions}
                  onChange={(values) => handleInputChange('conditions', values)}
                  placeholder="Décrire une condition d'utilisation..."
                  type="textarea"
                />
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Documents requis</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <DocumentField
                  label="Documents demandés"
                  values={formData.requiredDocuments}
                  onChange={(values) => handleInputChange('requiredDocuments', values)}
                  type={formData.requiredDocumentsType}
                  onTypeChange={(type) => handleInputChange('requiredDocumentsType', type)}
                />

                <DocumentField
                  label="Documents Complémentaires"
                  values={formData.complementaryDocuments}
                  onChange={(values) => handleInputChange('complementaryDocuments', values)}
                  type={formData.complementaryDocumentsType}
                  onTypeChange={(type) => handleInputChange('complementaryDocumentsType', type)}
                />
              </CardContent>
            </Card>

            {/* Modalités */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Modalités de la procédure</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="submissionLocation" className="text-sm font-medium text-gray-700">Où déposer le dossier - Administration concernée</Label>
                  <Input
                    id="submissionLocation"
                    value={formData.submissionLocation}
                    onChange={(e) => handleInputChange('submissionLocation', e.target.value)}
                    placeholder="Administration concernée"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Validité de la procédure */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">Validité de la procédure</Label>
                  <RadioGroup
                    value={formData.validityType}
                    onValueChange={(value) => handleInputChange('validityType', value)}
                    className="mb-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="periodic" id="periodic" />
                      <Label htmlFor="periodic">Périodique</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="open" id="open" />
                      <Label htmlFor="open">Ouverte</Label>
                    </div>
                  </RadioGroup>
                  {formData.validityType === 'periodic' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validityStartDate">Du</Label>
                        <Input
                          id="validityStartDate"
                          type="date"
                          value={formData.validityStartDate}
                          onChange={(e) => handleInputChange('validityStartDate', e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="validityEndDate">Au</Label>
                        <Input
                          id="validityEndDate"
                          type="date"
                          value={formData.validityEndDate}
                          onChange={(e) => handleInputChange('validityEndDate', e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="processingDuration" className="text-sm font-medium text-gray-700">Durée du traitement (jours)</Label>
                    <Input
                      id="processingDuration"
                      type="number"
                      value={formData.processingDuration}
                      onChange={(e) => handleInputChange('processingDuration', e.target.value)}
                      placeholder="Nombre de jours"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Frais</Label>
                    <RadioGroup
                      value={formData.feeType}
                      onValueChange={(value) => handleInputChange('feeType', value)}
                      className="mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gratuit" id="gratuit" />
                        <Label htmlFor="gratuit">Gratuit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="payant" id="payant" />
                        <Label htmlFor="payant">Payant</Label>
                      </div>
                    </RadioGroup>
                    {formData.feeType === 'payant' && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Montant en DA"
                          value={formData.feeAmount}
                          onChange={(e) => handleInputChange('feeAmount', e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Input
                          placeholder="Méthodes de paiement"
                          value={formData.paymentMethods}
                          onChange={(e) => handleInputChange('paymentMethods', e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Numérisation et modalités */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Numérisation et modalités</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Numérisation */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="digitization"
                      checked={formData.digitization}
                      onCheckedChange={(checked) => handleInputChange('digitization', checked)}
                    />
                    <Label htmlFor="digitization">Numérisation de la procédure</Label>
                  </div>

                  {formData.digitization && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted">
                      <div>
                        <Label htmlFor="digitizationDate">Date de la numérisation</Label>
                        <Input
                          id="digitizationDate"
                          type="date"
                          value={formData.digitizationDate}
                          onChange={(e) => handleInputChange('digitizationDate', e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="electronicPortalLink">Lien du portail électronique</Label>
                        <Input
                          id="electronicPortalLink"
                          type="url"
                          value={formData.electronicPortalLink}
                          onChange={(e) => handleInputChange('electronicPortalLink', e.target.value)}
                          placeholder="https://..."
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobileAppLink">Lien de l'application mobile (si elle existe)</Label>
                        <Input
                          id="mobileAppLink"
                          type="url"
                          value={formData.mobileAppLink}
                          onChange={(e) => handleInputChange('mobileAppLink', e.target.value)}
                          placeholder="https://..."
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modalités de retrait */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="thirdPartySubmission"
                      checked={formData.thirdPartySubmission}
                      onCheckedChange={(checked) => handleInputChange('thirdPartySubmission', checked)}
                    />
                    <Label htmlFor="thirdPartySubmission">Dépôt par une tierce personne</Label>
                  </div>

                  <div>
                    <Label htmlFor="withdrawalTime">Quand retirer l'acte ou le service administratif demandé</Label>
                    <Input
                      id="withdrawalTime"
                      value={formData.withdrawalTime}
                      onChange={(e) => handleInputChange('withdrawalTime', e.target.value)}
                      placeholder="Délai de retrait"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdrawalMethod">Comment retirer l'acte ou le service administratif demandé</Label>
                    <Textarea
                      id="withdrawalMethod"
                      value={formData.withdrawalMethod}
                      onChange={(e) => handleInputChange('withdrawalMethod', e.target.value)}
                      placeholder="Modalités de retrait"
                      rows={2}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentValidity">Validité de l'acte ou du service administratif demandé</Label>
                    <Input
                      id="documentValidity"
                      value={formData.documentValidity}
                      onChange={(e) => handleInputChange('documentValidity', e.target.value)}
                      placeholder="Durée de validité"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Recours */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasAppeal"
                      checked={formData.hasAppeal}
                      onCheckedChange={(checked) => handleInputChange('hasAppeal', checked)}
                    />
                    <Label htmlFor="hasAppeal">Recours disponible</Label>
                  </div>

                  {formData.hasAppeal && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted">
                      <div>
                        <Label htmlFor="appealLocation">Où déposer</Label>
                        <Input
                          id="appealLocation"
                          value={formData.appealLocation}
                          onChange={(e) => handleInputChange('appealLocation', e.target.value)}
                          placeholder="Lieu de dépôt du recours"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appealDeadline">Les délais</Label>
                        <Input
                          id="appealDeadline"
                          value={formData.appealDeadline}
                          onChange={(e) => handleInputChange('appealDeadline', e.target.value)}
                          placeholder="Délais de recours"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appealFees">Les frais</Label>
                        <Input
                          id="appealFees"
                          value={formData.appealFees}
                          onChange={(e) => handleInputChange('appealFees', e.target.value)}
                          placeholder="Frais de recours"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ancrage juridique et fichiers */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Ancrage juridique et fichiers</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <DynamicFieldList
                  label="Ancrage juridique"
                  values={formData.legalBasis}
                  onChange={(values) => handleInputChange('legalBasis', values)}
                  placeholder="Référence légale ou réglementaire..."
                  type="textarea"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadField
                    label="Guide d'utilisation à télécharger"
                    value={formData.userGuide}
                    onChange={(value) => handleInputChange('userGuide', value)}
                    accept=".pdf,.doc,.docx"
                  />

                  <FileUploadField
                    label="Formulaire à télécharger"
                    value={formData.downloadableForm}
                    onChange={(value) => handleInputChange('downloadableForm', value)}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations complémentaires */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Informations complémentaires</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="faq">Questions fréquemment posées</Label>
                  <Textarea
                    id="faq"
                    value={formData.faq}
                    onChange={(e) => handleInputChange('faq', e.target.value)}
                    placeholder="FAQ sur la procédure..."
                    rows={3}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                  
                  <div>
                    <Label htmlFor="contactAddress">Adresse</Label>
                    <Textarea
                      id="contactAddress"
                      value={formData.contactAddress}
                      onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                      placeholder="Adresse complète"
                      rows={2}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">N° Téléphone</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="Numéro de téléphone"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactGreenNumber">N° Vert</Label>
                      <Input
                        id="contactGreenNumber"
                        value={formData.contactGreenNumber}
                        onChange={(e) => handleInputChange('contactGreenNumber', e.target.value)}
                        placeholder="Numéro vert"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">E-mail</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="Adresse e-mail"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="px-8">
                Annuler
              </Button>
              <Button type="submit" className="px-8 bg-blue-600 hover:bg-blue-700 gap-2">
                <Save className="w-4 h-4" />
                Enregistrer la procédure
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
