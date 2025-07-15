
import React, { useEffect, useState } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Zap } from 'lucide-react';

interface PerformanceStats {
  loadTime: number;
  memoryUsage: number;
  interactions: number;
  slowOperations: number;
}

export function PerformanceOptimizer({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<PerformanceStats>({
    loadTime: 0,
    memoryUsage: 0,
    interactions: 0,
    slowOperations: 0
  });
  
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const report = performanceMonitor.getPerformanceReport();
      const newStats = {
        loadTime: report.vitals.loadComplete || performance.now(),
        memoryUsage: report.vitals.memoryUsage?.used || (performance as any).memory?.usedJSHeapSize || 0,
        interactions: report.vitals.recentMetrics?.filter((m: any) => m.category === 'interaction').length || 0,
        slowOperations: report.slowOperations?.length || 0
      };
      
      setStats(newStats);
      
      // Show alert if performance is degraded
      if (newStats.slowOperations > 5 || newStats.memoryUsage > 50000000) {
        setShowAlert(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {showAlert && (
        <Alert className="fixed top-16 right-4 z-[70] w-80 border-yellow-500 bg-yellow-50">
          <Activity className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Performance dégradée détectée. Optimisation en cours...
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-2 text-sm underline hover:no-underline"
            >
              OK
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Performance Monitor */}
      <div className="fixed bottom-16 right-4 z-[60]">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-gray-600">
            {stats.interactions} interactions
          </span>
        </div>
      </div>
      
      {children}
    </>
  );
}
