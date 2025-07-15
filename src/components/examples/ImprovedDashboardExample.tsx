/**
 * Exemple d'application des améliorations sur le Dashboard
 * Démontre l'utilisation des nouveaux systèmes de performance, sécurité et logging
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PerformanceOptimizedWrapper, usePerformanceMonitoring } from '@/components/common/PerformanceOptimizedWrapper';
import { securityManager, InputValidator } from '@/utils/security';
import { log } from '@/utils/logger';
import { ProcedureData, LegalTextData, SearchParams } from '@/types/common';
import { z } from 'zod';
import { FileText, Scale, Users, TrendingUp, Search, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalProcedures: number;
  totalLegalTexts: number;
  activeUsers: number;
  monthlyGrowth: number;
}

interface ImprovedDashboardProps {
  language?: string;
  userRole?: string;
}

export const ImprovedDashboardExample: React.FC<ImprovedDashboardProps> = ({
  language = 'fr',
  userRole = 'user'
}) => {
  const { renderTime } = usePerformanceMonitoring('ImprovedDashboard');
  
  // État avec types stricts (plus de 'any')
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalProcedures: 1250,
    totalLegalTexts: 8540,
    activeUsers: 320,
    monthlyGrowth: 12.5
  });
  const [recentProcedures] = useState<ProcedureData[]>([]);
  const [recentTexts] = useState<LegalTextData[]>([]);

  // Validation sécurisée des entrées
  const handleSearchChange = useCallback((value: string) => {
    const sanitizedValue = securityManager.sanitizeUserInput(value, 'text');
    
    // Validation avec Zod
    const validation = InputValidator.validateInput(
      sanitizedValue,
      InputValidator.createCustomValidator(
        z.string().min(0).max(100),
        'La recherche ne peut dépasser 100 caractères'
      )
    );

    if (validation.success && validation.data) {
      setSearchQuery(validation.data);
      log.audit('dashboard_search', { query: validation.data });
    } else {
      log.warn('Invalid search input', { errors: validation.errors });
    }
  }, []);

  // Mémorisation des données coûteuses
  const chartData = useMemo(() => {
    // Simulation de calculs coûteux pour les graphiques
    log.debug('Calculating chart data', { renderTime });
    
    return {
      procedures: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: Math.floor(Math.random() * 100) + 50
      })),
      legalTexts: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: Math.floor(Math.random() * 200) + 100
      }))
    };
  }, [renderTime]);

  // Gestion sécurisée des actions
  const handleQuickAction = useCallback((action: string) => {
    // Vérification des permissions
    if (!securityManager.checkPermission(userRole, 'write')) {
      log.securityAlert('Unauthorized action attempt', { action, userRole });
      return;
    }

    log.audit('dashboard_quick_action', { action });
    
    switch (action) {
      case 'new_procedure':
        // Navigation sécurisée
        break;
      case 'new_text':
        // Navigation sécurisée
        break;
      default:
        log.warn('Unknown dashboard action', { action });
    }
  }, [userRole]);

  // Composant de statistique optimisé
  const StatCard = React.memo<{
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: number;
    format?: 'number' | 'percentage';
  }>(({ title, value, icon, trend, format = 'number' }) => {
    const formattedValue = format === 'percentage' 
      ? `${value}%` 
      : value.toLocaleString('fr-FR');

    const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600';
    const trendIcon = trend && trend > 0 ? '↗' : '↘';

    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className="text-gray-400">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formattedValue}
          </div>
          {trend && (
            <p className={`text-xs ${trendColor} flex items-center mt-1`}>
              <span className="mr-1">{trendIcon}</span>
              {Math.abs(trend)}% ce mois
            </p>
          )}
        </CardContent>
      </Card>
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header avec recherche sécurisée */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord amélioré
          </h1>
          <p className="text-gray-600">
            Version optimisée avec sécurité renforcée
          </p>
        </div>

        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Recherche sécurisée..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
              maxLength={100}
            />
          </div>
          
          {securityManager.checkPermission(userRole, 'write') && (
            <Button onClick={() => handleQuickAction('new_procedure')}>
              Nouvelle procédure
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques avec optimisation des performances */}
      <PerformanceOptimizedWrapper
        name="dashboard-stats"
        enableIntersectionObserver={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Procédures"
            value={stats.totalProcedures}
            icon={<FileText className="w-4 h-4" />}
            trend={8.2}
          />
          <StatCard
            title="Textes juridiques"
            value={stats.totalLegalTexts}
            icon={<Scale className="w-4 h-4" />}
            trend={15.1}
          />
          <StatCard
            title="Utilisateurs actifs"
            value={stats.activeUsers}
            icon={<Users className="w-4 h-4" />}
            trend={-2.3}
          />
          <StatCard
            title="Croissance"
            value={stats.monthlyGrowth}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={12.5}
            format="percentage"
          />
        </div>
      </PerformanceOptimizedWrapper>

      {/* Section de contenu avec lazy loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceOptimizedWrapper
          name="recent-procedures"
          enableLazyLoading={true}
          enableIntersectionObserver={true}
        >
          <Card>
            <CardHeader>
              <CardTitle>Procédures récentes</CardTitle>
              <CardDescription>
                Dernières procédures ajoutées ou modifiées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentProcedures.length > 0 ? (
                <div className="space-y-3">
                  {recentProcedures.slice(0, 5).map((procedure) => (
                    <div key={procedure.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {procedure.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {procedure.institution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Aucune procédure récente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </PerformanceOptimizedWrapper>

        <PerformanceOptimizedWrapper
          name="recent-texts"
          enableLazyLoading={true}
          enableIntersectionObserver={true}
        >
          <Card>
            <CardHeader>
              <CardTitle>Textes récents</CardTitle>
              <CardDescription>
                Derniers textes juridiques publiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTexts.length > 0 ? (
                <div className="space-y-3">
                  {recentTexts.slice(0, 5).map((text) => (
                    <div key={text.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <Scale className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {text.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {text.organization} • {new Date(text.publicationDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Aucun texte récent</p>
                </div>
              )}
            </CardContent>
          </Card>
        </PerformanceOptimizedWrapper>
      </div>

      {/* Informations de performance en développement */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed border-yellow-300 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Temps de rendu: {renderTime}ms | Mode développement
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};