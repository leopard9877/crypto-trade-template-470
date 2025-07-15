import React, { Suspense, lazy, useMemo } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { useModal } from './EnhancedModalManager';
import { ModalConfig } from './ModalTypes';

// Lazy load modal components for better performance
const modalComponents = {
  'ai-generation': lazy(() => import('../AIGenerationModal')),
  'api-import': lazy(() => import('../ApiImportModal')),
  'user-management': lazy(() => import('../UserManagementModal')),
  'workflow': lazy(() => import('../WorkflowModal')),
  'analysis': lazy(() => import('../AnalysisModal')),
  'export': lazy(() => import('../ExportModal')),
  'feedback': lazy(() => import('../FeedbackModal')),
  'alert': lazy(() => import('../alert/AlertModal')),
  'confirmation': lazy(() => import('../common/ConfirmationModal')),
  'form': lazy(() => import('../common/FormModal')),
  'viewer': lazy(() => import('../DocumentViewerModal')),
  'settings': lazy(() => import('../common/SettingsModal')),
};

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    <span className="ml-2 text-gray-600">Chargement...</span>
  </div>
);

const ModalWrapper: React.FC<{ modal: ModalConfig }> = ({ modal }) => {
  const { closeModal, goBack, history } = useModal();
  
  const ModalComponent = useMemo(() => {
    const component = modalComponents[modal.component as keyof typeof modalComponents];
    if (!component) {
      console.warn(`Modal component "${modal.component}" not found`);
      return null;
    }
    return component;
  }, [modal.component]);

  if (!ModalComponent) {
    return (
      <DialogContent className="max-w-md">
        <div className="p-6 text-center">
          <p className="text-red-600">Composant modal introuvable: {modal.component}</p>
          <Button onClick={() => closeModal(modal.id)} className="mt-4">
            Fermer
          </Button>
        </div>
      </DialogContent>
    );
  }

  const handleClose = () => {
    if (modal.closable !== false) {
      closeModal(modal.id);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modal.backdrop === 'static') return;
    if (modal.backdrop === 'click' || modal.backdrop === undefined) {
      e.stopPropagation();
      handleClose();
    }
  };

  const canGoBack = history.length > 1;
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleClose}>
      <DialogOverlay 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleBackdropClick}
      />
      <DialogContent 
        className={`
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-white rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-hidden
          animate-in fade-in-0 zoom-in-95 duration-200
          ${sizeClasses[modal.size || 'md']}
        `}
        onInteractOutside={(e) => {
          if (modal.backdrop === 'static') {
            e.preventDefault();
          }
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="p-2"
                aria-label="Retour"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {modal.title && (
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.title}
              </h2>
            )}
          </div>
          
          {modal.closable !== false && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2 hover:bg-gray-100"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <Suspense fallback={<LoadingFallback />}>
            <ModalComponent
              {...modal.props}
              isOpen={modal.isOpen}
              onClose={handleClose}
              modalId={modal.id}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EnhancedModalRenderer: React.FC = () => {
  const { modals } = useModal();
  
  // Sort modals by priority (higher priority on top)
  const sortedModals = useMemo(() => 
    [...modals]
      .filter(modal => modal.isOpen)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0)),
    [modals]
  );

  return (
    <>
      {sortedModals.map((modal) => (
        <ModalWrapper key={modal.id} modal={modal} />
      ))}
    </>
  );
};

export default EnhancedModalRenderer;