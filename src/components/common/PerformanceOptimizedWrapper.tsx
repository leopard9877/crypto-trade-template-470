/**
 * Wrapper d'optimisation des performances pour les composants React
 * Utilise React.memo, lazy loading et intersection observer
 */

import React, { Suspense, lazy, memo, useRef, useEffect, useState } from 'react';
import { log } from '@/utils/logger';

interface PerformanceOptimizedWrapperProps {
  children: React.ReactNode;
  name: string;
  enableLazyLoading?: boolean;
  enableIntersectionObserver?: boolean;
  loadingComponent?: React.ComponentType;
  errorBoundary?: React.ComponentType<{ error: Error; resetError: () => void }>;
  className?: string;
}

// Composant de chargement par défaut
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <span className="ml-2 text-gray-600">Chargement...</span>
  </div>
);

// Boundary d'erreur par défaut
const DefaultErrorBoundary: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h3 className="text-red-800 font-medium">Une erreur est survenue</h3>
    <p className="text-red-600 text-sm mt-1">{error.message}</p>
    <button
      onClick={resetError}
      className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
    >
      Réessayer
    </button>
  </div>
);

// Hook pour l'intersection observer
const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
        log.debug('Component entered viewport', { component: element.dataset.name });
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Wrapper d'erreur pour les composants
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: React.ComponentType<{ error: Error; resetError: () => void }>;
    name: string;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    log.error(`Error in component ${this.props.name}`, { error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export const PerformanceOptimizedWrapper: React.FC<PerformanceOptimizedWrapperProps> = memo(({
  children,
  name,
  enableLazyLoading = false,
  enableIntersectionObserver = false,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorBoundary: ErrorBoundaryComponent = DefaultErrorBoundary,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(!enableIntersectionObserver);
  
  const { hasIntersected } = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (enableIntersectionObserver && hasIntersected) {
      setShouldRender(true);
    }
  }, [enableIntersectionObserver, hasIntersected]);

  const renderContent = () => {
    if (!shouldRender) {
      return <LoadingComponent />;
    }

    if (enableLazyLoading) {
      return (
        <Suspense fallback={<LoadingComponent />}>
          {children}
        </Suspense>
      );
    }

    return children;
  };

  return (
    <ErrorBoundary fallback={ErrorBoundaryComponent} name={name}>
      <div 
        ref={ref} 
        className={className}
        data-name={name}
        data-performance-optimized="true"
      >
        {renderContent()}
      </div>
    </ErrorBoundary>
  );
});

PerformanceOptimizedWrapper.displayName = 'PerformanceOptimizedWrapper';

// HOC pour optimiser automatiquement les composants
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options: Partial<PerformanceOptimizedWrapperProps> = {}
) => {
  const OptimizedComponent = memo((props: P) => (
    <PerformanceOptimizedWrapper {...options}>
      <Component {...props} />
    </PerformanceOptimizedWrapper>
  ));

  OptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
};

// Hook pour mesurer les performances des composants
export const usePerformanceMonitoring = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - renderStartTime.current;
    setRenderTime(duration);
    
    if (duration > 100) { // Log si le rendu prend plus de 100ms
      log.warn(`Slow component render detected`, { 
        component: componentName, 
        duration: `${duration}ms` 
      });
    }
    
    renderStartTime.current = endTime;
  });

  return { renderTime };
};

// Utilitaire pour créer des composants lazy avec gestion d'erreur
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  componentName: string
) => {
  return lazy(async () => {
    try {
      log.debug(`Loading lazy component: ${componentName}`);
      const module = await importFunc();
      log.debug(`Loaded lazy component: ${componentName}`);
      return module;
    } catch (error) {
      log.error(`Failed to load lazy component: ${componentName}`, error);
      throw error;
    }
  });
};