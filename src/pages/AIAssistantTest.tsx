import { ConversationalAIAssistant } from '@/components/ai/ConversationalAIAssistant';
import { ContextualSearchAssistant } from '@/components/ai/ContextualSearchAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Search, TestTube } from 'lucide-react';

export default function AIAssistantTest() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6 text-purple-600" />
            Page de Test - Assistants IA Améliorés
          </CardTitle>
          <p className="text-gray-600">
            Testez les nouvelles fonctionnalités d'analyse juridique avancée de l'IA
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-blue-600" />
              Assistant Conversationnel IA
            </CardTitle>
            <p className="text-sm text-gray-600">
              Avec extraction d'entités, analyse de risque, prédiction d'issues et analyse de sentiment
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <ConversationalAIAssistant />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5 text-green-600" />
              Assistant de Recherche Contextuel
            </CardTitle>
            <p className="text-sm text-gray-600">
              Analyse de l'intention utilisateur et suggestions contextuelles
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <ContextualSearchAssistant />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exemples de Tests Recommandés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Assistant Conversationnel - Tests :</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <strong>Test Extraction d'Entités :</strong><br />
                  "Le contrat signé le 15 mars 2024 pour un montant de 50 000€ selon l'article 1101 du Code civil"
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <strong>Test Analyse de Risque :</strong><br />
                  "Responsabilité civile avec sanctions pénales et dommages-intérêts"
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <strong>Test Prédiction :</strong><br />
                  "Litige contractuel avec rupture de contrat de fourniture"
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <strong>Test Sentiment :</strong><br />
                  "Décision favorable avec approbation du projet"
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Assistant Contextuel - Tests :</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-yellow-50 rounded">
                  <strong>Test Création Entreprise :</strong><br />
                  "Je veux créer une SARL, quelles sont les étapes ?"
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <strong>Test Permis de Construire :</strong><br />
                  "Comment déposer un permis de construire ?"
                </div>
                <div className="p-3 bg-indigo-50 rounded">
                  <strong>Test Marchés Publics :</strong><br />
                  "Seuils des marchés publics en 2024"
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}