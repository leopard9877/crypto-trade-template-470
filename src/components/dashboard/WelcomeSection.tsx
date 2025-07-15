import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Zap } from "lucide-react";

interface WelcomeSectionProps {
  language?: string;
  onAskQuestion?: () => void;
}

export const WelcomeSection = React.memo(({ language = "fr", onAskQuestion }: WelcomeSectionProps) => {
  const getText = (key: string) => {
    const translations = {
      fr: {
        welcome: "Bienvenue sur dalil.dz",
        subtitle: "Votre plateforme de veille juridique et réglementaire",
        aiAssistant: "Assistant IA Juridique",
        aiDescription: "Posez vos questions juridiques et obtenez des réponses précises",
        askQuestion: "Poser une question",
      },
      en: {
        welcome: "Welcome to dalil.dz",
        subtitle: "Your legal and regulatory monitoring platform",
        aiAssistant: "Legal AI Assistant",
        aiDescription: "Ask your legal questions and get precise answers",
        askQuestion: "Ask a question",
      },
      ar: {
        welcome: "مرحباً بكم في dalil.dz",
        subtitle: "منصتكم لمراقبة القوانين والأنظمة",
        aiAssistant: "المساعد القانوني الذكي",
        aiDescription: "اطرحوا أسئلتكم القانونية واحصلوا على إجابات دقيقة",
        askQuestion: "طرح سؤال",
      },
    }[language] || translations.fr;

    return translations[key] || key;
  };

  return (
    <div className="mb-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {getText("welcome")}
        </h1>
        <p className="text-xl text-gray-600">
          {getText("subtitle")}
        </p>
      </div>

      {/* AI Assistant Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Bot className="w-6 h-6" />
            {getText("aiAssistant")}
          </CardTitle>
          <CardDescription className="text-blue-700">
            {getText("aiDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onAskQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            {getText("askQuestion")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

WelcomeSection.displayName = 'WelcomeSection';