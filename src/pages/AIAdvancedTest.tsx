
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PredictiveJuridicalAnalysis } from '@/components/ai/PredictiveJuridicalAnalysis';
import { SpecializedNLP } from '@/components/ai/SpecializedNLP';
import { Brain, Zap, TestTube, TrendingUp, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

export default function AIAdvancedTest() {
  const testScenarios = {
    prediction: [
      {
        title: "Test Litige Contractuel",
        description: "Contrat de fourniture signé le 15 mars 2024 entre SARL TechCorp et SAS Digital Solutions pour un montant de 150 000€. Clause de force majeure présente. Retard de livraison de 30 jours. Client demande résiliation et dommages-intérêts selon article 1184 du Code civil.",
        expected: "Analyse de probabilité de succès, facteurs de risque, cas similaires"
      },
      {
        title: "Test Analyse de Risque",
        description: "Société soumise à audit RGPD. Clauses de confidentialité incomplètes. Processus de traitement des données non documentés. Sanctions CNIL possibles. Responsabilité civile et pénale du dirigeant engagée.",
        expected: "Score de conformité, facteurs de risque, recommandations"
      }
    ],
    nlp: [
      {
        title: "Test Extraction d'Entités",
        description: "M. Jean Dupont, directeur de la SARL Innovation Tech, domiciliée au 15 rue de la Paix 75001 Paris, a signé le 20 janvier 2024 un contrat de prestation avec Mme Marie Martin pour un montant de 50 000€ selon l'article 1101 du Code civil.",
        expected: "Personnes, sociétés, dates, montants, références juridiques"
      },
      {
        title: "Test Classification",
        description: "Contrat de bail commercial avec clause d'indexation, durée de 9 ans, loyer de 5000€/mois, caution solidaire, clause résolutoire, dépôt de garantie de 15000€, état des lieux contradictoire.",
        expected: "Droit immobilier, bail commercial, classification spécialisée"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6 text-purple-600" />
            Page de Test - IA et NLP Juridique Avancés
          </CardTitle>
          <p className="text-gray-600">
            Testez les nouvelles fonctionnalités d'analyse prédictive et de NLP juridique spécialisé
          </p>
          <div className="flex gap-2">
            <Badge className="bg-purple-600 text-white">Analyse Prédictive</Badge>
            <Badge className="bg-blue-600 text-white">NLP Spécialisé</Badge>
            <Badge variant="outline">Tests Intégrés</Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="prediction-test" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prediction-test" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Test Analyse Prédictive
          </TabsTrigger>
          <TabsTrigger value="nlp-test" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Test NLP Spécialisé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prediction-test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Tests d'Analyse Prédictive Juridique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {testScenarios.prediction.map((scenario, index) => (
                  <Card key={index} className="border-2 border-dashed border-purple-200">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-sm">{scenario.title}</h4>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-xs">
                          <strong>Texte de test :</strong><br />
                          {scenario.description}
                        </div>
                        <div className="p-3 bg-blue-50 rounded text-xs">
                          <strong>Résultats attendus :</strong><br />
                          {scenario.expected}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <PredictiveJuridicalAnalysis />
        </TabsContent>

        <TabsContent value="nlp-test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Tests de NLP Juridique Spécialisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {testScenarios.nlp.map((scenario, index) => (
                  <Card key={index} className="border-2 border-dashed border-blue-200">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-sm">{scenario.title}</h4>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-xs">
                          <strong>Texte de test :</strong><br />
                          {scenario.description}
                        </div>
                        <div className="p-3 bg-blue-50 rounded text-xs">
                          <strong>Résultats attendus :</strong><br />
                          {scenario.expected}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <SpecializedNLP />
        </TabsContent>
      </Tabs>

      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-600" />
            Instructions de Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-600">Analyse Prédictive :</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">1.</span>
                  Copiez un des textes de test dans le champ d'analyse
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">2.</span>
                  Cliquez sur "Lancer l'analyse prédictive"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">3.</span>
                  Explorez les onglets : Prédiction, Risques, Anomalies, Recommandations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">4.</span>
                  Vérifiez les probabilités, scores et suggestions
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">NLP Spécialisé :</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">1.</span>
                  Utilisez les textes d'exemple ou vos propres documents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">2.</span>
                  Lancez l'analyse NLP
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">3.</span>
                  Consultez les 4 onglets : Entités, Résumé, Classification, Sentiment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">4.</span>
                  Vérifiez la précision de l'extraction et de l'analyse
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
