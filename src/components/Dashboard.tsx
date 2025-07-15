import React, { useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalDashboard } from "./dashboard/PersonalDashboard";
import { WelcomeSection } from "./dashboard/WelcomeSection";
import { StatsSection } from "./dashboard/StatsSection";
import { QuickAccessSection } from "./dashboard/QuickAccessSection";

interface DashboardProps {
  language?: string;
  onSectionChange?: (section: string) => void;
}

export const Dashboard = React.memo(({ language = "fr", onSectionChange }: DashboardProps) => {
  const getText = useMemo(() => (key: string) => {
    const translations = {
      fr: {
        overview: "Vue d'ensemble",
        personal: "Personnel",
        analytics: "Analytics"
      },
      en: {
        overview: "Overview", 
        personal: "Personal",
        analytics: "Analytics"
      },
      ar: {
        overview: "نظرة عامة",
        personal: "شخصي", 
        analytics: "التحليلات"
      },
    }[language] || translations.fr;

    return translations[key] || key;
  }, [language]);

  const handleAskQuestion = useCallback(() => {
    if (onSectionChange) {
      onSectionChange('ai-assistant');
    }
  }, [onSectionChange]);

  const handleQuickAccess = useCallback((section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  }, [onSectionChange]);

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{getText("overview")}</TabsTrigger>
          <TabsTrigger value="personal">{getText("personal")}</TabsTrigger>
          <TabsTrigger value="analytics">{getText("analytics")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <WelcomeSection 
            language={language}
            onAskQuestion={handleAskQuestion}
          />
          
          <StatsSection language={language} />
          
          <QuickAccessSection 
            language={language}
            onSectionChange={handleQuickAccess}
          />
        </TabsContent>
        
        <TabsContent value="personal">
          <PersonalDashboard language={language} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="p-6 text-center text-gray-500">
            Analytics dashboard en cours de développement...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
