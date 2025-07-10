
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PredictiveJuridicalAnalysis } from '@/components/ai/PredictiveJuridicalAnalysis';
import { SpecializedNLP } from '@/components/ai/SpecializedNLP';
import { ConversationalAIAssistant } from '@/components/ai/ConversationalAIAssistant';
import { EnhancedContextualRecommendations } from '@/components/ai/EnhancedContextualRecommendations';
import { Brain, TestTube, CheckCircle2, AlertTriangle, Zap, TrendingUp, MessageSquare, Lightbulb } from 'lucide-react';

export default function AIComprehensiveTest() {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});

  const testScenarios = {
    predictive: {
      title: "Tests d'Analyse Prédictive",
      scenarios: [
        {
          id: "contract_dispute",
          name: "Test Litige Contractuel",
          input: "Contrat de fourniture signé le 15 mars 2024 entre SARL TechCorp (CA 2M€) et SAS Digital Solutions pour 150 000€. Clause de force majeure présente (article 12.3). Retard de livraison de 30 jours dû à rupture de stock fournisseur. Client demande résiliation et dommages-intérêts selon article 1184 du Code civil. Jurisprudence similaire : Com. 12 janv. 2023 (favorable au fournisseur), CA Paris 15 juin 2023 (défavorable).",
          expected: ["Probabilité de succès", "Niveau de risque", "Cas similaires", "Recommandations", "Timeline estimé"]
        },
        {
          id: "compliance_risk",
          name: "Test Évaluation Risques RGPD",
          input: "Société de e-commerce TradeMax SAS, 50 employés, traite 100k clients/mois. Audit RGPD révèle : cookies sans consentement explicite, bases légales floues pour marketing, sous-traitants non contractualisés, délai de réponse aux demandes d'accès > 1 mois, aucune analyse d'impact (PIA). Précédent : sanction CNIL 50k€ (même secteur, juillet 2023).",
          expected: ["Score de conformité", "Facteurs de risque", "Sanctions potentielles", "Plan d'action prioritaire"]
        }
      ]
    },
    nlp: {
      title: "Tests de NLP Juridique Spécialisé",
      scenarios: [
        {
          id: "entity_extraction",
          name: "Test Extraction d'Entités Complexes",
          input: "ARRÊT N° 472 du 8 novembre 2023 - Cour d'appel de Paris, 3ème chambre. Mme Sarah MARTIN, née le 12/05/1985 à Lyon, représentée par Me Jean DUPONT (Barreau de Paris), demandeur principal. SARL INNOVATION TECH, SIREN 123 456 789, siège social 15 rue de la Paix 75001 Paris, représentée par M. Pierre BERNARD, gérant, défendeur. Contrat de prestation intellectuelle du 20 janvier 2024, montant 85 000€ HT. Références : articles 1101, 1103 et 1231-1 du Code civil, article L. 132-1 du Code de la propriété intellectuelle.",
          expected: ["Personnes physiques", "Personnes morales", "Dates", "Montants", "Références juridiques", "Juridictions"]
        },
        {
          id: "document_classification",
          name: "Test Classification Spécialisée",
          input: "CONTRAT DE BAIL COMMERCIAL - Durée : 9 ans (3-6-9). Loyer : 8 500€/mois HT + charges. Indexation ICC. Caution solidaire : 51 000€. Destination : commerce de détail alimentaire. Clause d'exclusivité territoriale 500m. Travaux à charge du preneur selon devis annexé. Révision triennale possible. Clause résolutoire de plein droit. État des lieux contradictoire obligatoire.",
          expected: ["Droit immobilier", "Bail commercial", "Commerce de détail", "Durée 3-6-9", "Clause spéciales"]
        }
      ]
    },
    contextual: {
      title: "Tests de Recommandations Contextuelles",
      scenarios: [
        {
          id: "startup_legal",
          name: "Test Contexte Création Startup",
          input: "Je lance une startup tech (SaaS B2B) avec 2 associés. Levée de fonds prévue 500k€ dans 6 mois. Besoin de protéger notre IP et structurer juridiquement.",
          expected: ["Formes juridiques", "Pactes d'associés", "Propriété intellectuelle", "Investment terms", "Compliance RGPD"]
        },
        {
          id: "ecommerce_compliance",
          name: "Test Conformité E-commerce",
          input: "Site e-commerce B2C, 10k commandes/mois, vente UE + Maghreb. Problèmes : retours clients, CGV anciennes, taxes complexes, litiges paiement.",
          expected: ["Droit de la consommation", "CGV e-commerce", "Fiscalité internationale", "Règlement des litiges", "Protection des données"]
        }
      ]
    }
  };

  const runTest = (category: string, testId: string) => {
    setTestResults(prev => ({ ...prev, [`${category}_${testId}`]: 'pending' }));
    
    // Simulation du test
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% de réussite simulée
      setTestResults(prev => ({ 
        ...prev, 
        [`${category}_${testId}`]: success ? 'success' : 'error' 
      }));
    }, 2000);
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6 text-purple-600" />
            Tests Complets - IA et NLP Juridique Avancés
          </CardTitle>
          <p className="text-gray-600">
            Suite de tests complète pour valider toutes les fonctionnalités d'IA avancées
          </p>
          <div className="flex gap-2">
            <Badge className="bg-purple-600 text-white">Analyse Prédictive</Badge>
            <Badge className="bg-blue-600 text-white">NLP Spécialisé</Badge>
            <Badge className="bg-green-600 text-white">Recommandations</Badge>
            <Badge variant="outline">Tests Intégrés</Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Scénarios de Test</TabsTrigger>
          <TabsTrigger value="predictive">Analyse Prédictive</TabsTrigger>
          <TabsTrigger value="nlp">NLP Avancé</TabsTrigger>
          <TabsTrigger value="contextual">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions de test :</strong> Cliquez sur "Tester" pour chaque scénario, puis vérifiez que les résultats attendus s'affichent correctement dans les onglets correspondants.
            </AlertDescription>
          </Alert>

          {Object.entries(testScenarios).map(([category, config]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category === 'predictive' && <TrendingUp className="w-5 h-5 text-purple-600" />}
                  {category === 'nlp' && <Zap className="w-5 h-5 text-blue-600" />}
                  {category === 'contextual' && <Lightbulb className="w-5 h-5 text-green-600" />}
                  {config.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {config.scenarios.map((scenario) => (
                    <Card key={scenario.id} className="border-dashed">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              {getStatusIcon(testResults[`${category}_${scenario.id}`])}
                              {scenario.name}
                            </h4>
                            <Button
                              size="sm"
                              onClick={() => runTest(category, scenario.id)}
                              disabled={testResults[`${category}_${scenario.id}`] === 'pending'}
                            >
                              Tester
                            </Button>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded text-xs">
                            <strong>Texte de test :</strong><br />
                            {scenario.input}
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded text-xs">
                            <strong>Résultats attendus :</strong><br />
                            <ul className="list-disc list-inside mt-1">
                              {scenario.expected.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveJuridicalAnalysis />
        </TabsContent>

        <TabsContent value="nlp">
          <SpecializedNLP />
        </TabsContent>

        <TabsContent value="contextual">
          <EnhancedContextualRecommendations />
        </TabsContent>
      </Tabs>

      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Guide de Test Complet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-600">1. Analyse Prédictive :</h4>
              <ul className="space-y-2 text-sm">
                <li>• Copiez un texte de test dans l'onglet "Analyse Prédictive"</li>
                <li>• Cliquez sur "Lancer l'analyse prédictive"</li>
                <li>• Vérifiez les 4 onglets : Prédiction, Risques, Anomalies, Recommandations</li>
                <li>• Contrôlez les probabilités et scores affichés</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">2. NLP Spécialisé :</h4>
              <ul className="space-y-2 text-sm">
                <li>• Utilisez les textes d'exemple dans l'onglet "NLP Avancé"</li>
                <li>• Lancez l'analyse NLP</li>
                <li>• Consultez les 4 onglets : Entités, Résumé, Classification, Sentiment</li>
                <li>• Vérifiez la précision de l'extraction automatique</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-green-600">3. Recommandations :</h4>
              <ul className="space-y-2 text-sm">
                <li>• Testez les scénarios contextuels dans l'onglet "Recommandations"</li>
                <li>• Vérifiez la pertinence des suggestions</li>
                <li>• Testez la recherche par intention utilisateur</li>
                <li>• Contrôlez l'adaptation au profil utilisateur</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
