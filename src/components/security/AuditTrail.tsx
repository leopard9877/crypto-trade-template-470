import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  User, 
  Search, 
  Filter,
  Download,
  Eye,
  Activity
} from 'lucide-react';
import { AuditLog } from '@/schemas/securitySchemas';
import { useGlobalStore } from '@/store/globalStore';

interface AuditTrailProps {
  className?: string;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ className }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useGlobalStore();

  // Mock data - in production, this would come from an API
  const mockAuditLogs: AuditLog[] = [
    {
      userId: 'user-123',
      action: 'LOGIN',
      resource: 'authentication',
      details: { method: 'email', success: true },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      severity: 'low'
    },
    {
      userId: 'user-456',
      action: 'DOCUMENT_ACCESS',
      resource: 'legal-text-789',
      details: { documentTitle: 'Code pénal - Article 123', accessType: 'view' },
      ipAddress: '10.0.0.5',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: new Date('2024-01-15T11:15:00Z'),
      severity: 'low'
    },
    {
      userId: 'admin-001',
      action: 'USER_MODIFICATION',
      resource: 'user-management',
      details: { targetUser: 'user-789', changes: ['role', 'permissions'] },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: new Date('2024-01-15T09:45:00Z'),
      severity: 'medium'
    },
    {
      userId: 'system',
      action: 'SECURITY_ALERT',
      resource: 'authentication',
      details: { reason: 'Multiple failed login attempts', attempts: 5 },
      ipAddress: '198.51.100.10',
      userAgent: 'Unknown',
      timestamp: new Date('2024-01-15T08:20:00Z'),
      severity: 'high'
    },
    {
      userId: 'user-999',
      action: 'DATA_EXPORT',
      resource: 'procedures-catalog',
      details: { format: 'CSV', recordCount: 1500 },
      ipAddress: '203.0.113.15',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      timestamp: new Date('2024-01-15T14:30:00Z'),
      severity: 'medium'
    }
  ];

  useEffect(() => {
    setAuditLogs(mockAuditLogs);
    setFilteredLogs(mockAuditLogs);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = auditLogs;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(term) ||
        log.resource.toLowerCase().includes(term) ||
        log.userId?.toLowerCase().includes(term) ||
        JSON.stringify(log.details).toLowerCase().includes(term)
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Apply action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [auditLogs, searchTerm, severityFilter, actionFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Shield className="w-4 h-4" />;
      case 'low':
        return <Activity className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleExport = () => {
    // Mock export functionality
    const csvData = filteredLogs.map(log => ({
      Timestamp: log.timestamp.toISOString(),
      User: log.userId || 'System',
      Action: log.action,
      Resource: log.resource,
      Severity: log.severity,
      IP: log.ipAddress,
      Details: JSON.stringify(log.details)
    }));

    addNotification({
      type: 'success',
      message: `Export de ${csvData.length} entrées d'audit initiée`,
      read: false
    });
  };

  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Journal d'Audit et Sécurité
        </CardTitle>
        <CardDescription>
          Suivi des actions et événements de sécurité en temps réel
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['critical', 'high', 'medium', 'low'].map(severity => {
            const count = filteredLogs.filter(log => log.severity === severity).length;
            return (
              <div key={severity} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`inline-flex items-center gap-1 ${getSeverityColor(severity)} px-2 py-1 rounded text-sm`}>
                  {getSeverityIcon(severity)}
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </div>
                <div className="text-2xl font-bold mt-1">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Audit Logs */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun log d'audit trouvé</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(log.severity)}>
                        {getSeverityIcon(log.severity)}
                        {log.severity}
                      </Badge>
                      <span className="text-sm font-mono text-gray-600">
                        {log.action}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{log.userId || 'Système'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{log.resource}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{log.timestamp.toLocaleString('fr-FR')}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-mono">{log.ipAddress}</span>
                      </div>
                      
                      {log.details && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;