import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Scale 
} from "lucide-react";

interface QuickAccessSectionProps {
  language?: string;
  onSectionChange?: (section: string) => void;
}

interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  section: string;
  color: string;
}

export const QuickAccessSection = React.memo(({ 
  language = "fr", 
  onSectionChange 
}: QuickAccessSectionProps) => {
  const getText = (key: string) => {
    const translations = {
      fr: {
        quickAccess: "Accès rapide",
        searchLegal: "Recherche avancée",
        searchDesc: "Recherchez dans notre base de données juridiques",
        procedures: "Procédures",
        proceduresDesc: "Accédez aux procédures administratives",
        forum: "Forum",
        forumDesc: "Échangez avec la communauté juridique",
        analytics: "Analyses",
        analyticsDesc: "Consultez vos rapports et statistiques",
        legalTexts: "Textes juridiques",
        legalTextsDesc: "Parcourez la législation en vigueur",
        assistedWriting: "Rédaction assistée",
        assistedWritingDesc: "Outils d'aide à la rédaction juridique",
        access: "Accéder",
      },
      en: {
        quickAccess: "Quick Access",
        searchLegal: "Advanced Search",
        searchDesc: "Search our legal database",
        procedures: "Procedures",
        proceduresDesc: "Access administrative procedures",
        forum: "Forum",
        forumDesc: "Connect with the legal community",
        analytics: "Analytics",
        analyticsDesc: "View your reports and statistics",
        legalTexts: "Legal Texts",
        legalTextsDesc: "Browse current legislation",
        assistedWriting: "Assisted Writing",
        assistedWritingDesc: "Legal writing assistance tools",
        access: "Access",
      },
      ar: {
        quickAccess: "الوصول السريع",
        searchLegal: "البحث المتقدم",
        searchDesc: "ابحث في قاعدة البيانات القانونية",
        procedures: "الإجراءات",
        proceduresDesc: "الوصول إلى الإجراءات الإدارية",
        forum: "المنتدى",
        forumDesc: "تواصل مع المجتمع القانوني",
        analytics: "التحليلات",
        analyticsDesc: "اطلع على التقارير والإحصائيات",
        legalTexts: "النصوص القانونية",
        legalTextsDesc: "استعرض التشريعات السارية",
        assistedWriting: "الكتابة المساعدة",
        assistedWritingDesc: "أدوات مساعدة الكتابة القانونية",
        access: "الوصول",
      },
    }[language] || translations.fr;

    return translations[key] || key;
  };

  const quickAccessItems: QuickAccessItem[] = [
    {
      title: getText("searchLegal"),
      description: getText("searchDesc"),
      icon: <Search className="w-8 h-8" />,
      section: "advanced-search",
      color: "text-blue-600"
    },
    {
      title: getText("legalTexts"),
      description: getText("legalTextsDesc"),
      icon: <FileText className="w-8 h-8" />,
      section: "legal-catalog",
      color: "text-green-600"
    },
    {
      title: getText("procedures"),
      description: getText("proceduresDesc"),
      icon: <Scale className="w-8 h-8" />,
      section: "procedures-catalog",
      color: "text-purple-600"
    },
    {
      title: getText("assistedWriting"),
      description: getText("assistedWritingDesc"),
      icon: <BookOpen className="w-8 h-8" />,
      section: "assisted-writing",
      color: "text-orange-600"
    },
    {
      title: getText("forum"),
      description: getText("forumDesc"),
      icon: <MessageSquare className="w-8 h-8" />,
      section: "forum",
      color: "text-red-600"
    },
    {
      title: getText("analytics"),
      description: getText("analyticsDesc"),
      icon: <BarChart3 className="w-8 h-8" />,
      section: "analytics-dashboards",
      color: "text-indigo-600"
    },
  ];

  const handleAccess = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {getText("quickAccess")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccessItems.map((item, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className={item.color}>
                  {item.icon}
                </span>
                {item.title}
              </CardTitle>
              <CardDescription>
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleAccess(item.section)}
                className="w-full"
                variant="outline"
              >
                {getText("access")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

QuickAccessSection.displayName = 'QuickAccessSection';