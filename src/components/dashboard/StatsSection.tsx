import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Users, TrendingUp } from "lucide-react";

interface StatsSectionProps {
  language?: string;
}

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export const StatsSection = React.memo(({ language = "fr" }: StatsSectionProps) => {
  const getText = (key: string) => {
    const translations = {
      fr: {
        stats: "Statistiques",
        texts: "Textes juridiques",
        procedures: "Procédures",
        users: "Utilisateurs actifs",
        updates: "Mises à jour",
      },
      en: {
        stats: "Statistics",
        texts: "Legal texts",
        procedures: "Procedures",
        users: "Active users",
        updates: "Updates",
      },
      ar: {
        stats: "الإحصائيات",
        texts: "النصوص القانونية",
        procedures: "الإجراءات",
        users: "المستخدمون النشطون",
        updates: "التحديثات",
      },
    }[language] || translations.fr;

    return translations[key] || key;
  };

  const stats: StatItem[] = [
    {
      title: getText("texts"),
      value: "15,847",
      change: "+12%",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      trend: 'up'
    },
    {
      title: getText("procedures"),
      value: "2,456",
      change: "+8%",
      icon: <Scale className="w-6 h-6 text-green-600" />,
      trend: 'up'
    },
    {
      title: getText("users"),
      value: "8,932",
      change: "+15%",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      trend: 'up'
    },
    {
      title: getText("updates"),
      value: "342",
      change: "+23%",
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      trend: 'up'
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {getText("stats")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} depuis le mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

StatsSection.displayName = 'StatsSection';