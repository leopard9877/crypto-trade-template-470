export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

export interface ModalConfig extends BaseModalProps {
  id: string;
  component: string;
  props?: Record<string, any>;
  priority?: number;
  persistent?: boolean;
  backdrop?: 'static' | 'click' | 'none';
}

export type ModalType = 
  | 'alert'
  | 'confirmation'
  | 'form'
  | 'viewer'
  | 'settings'
  | 'ai-generation'
  | 'api-import'
  | 'user-management'
  | 'workflow'
  | 'analysis'
  | 'export'
  | 'feedback'
  | 'help'
  | 'custom';

export interface ModalState {
  modals: ModalConfig[];
  activeModalId?: string;
  history: string[];
}

export interface ModalActions {
  openModal: (config: Omit<ModalConfig, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
  navigateToModal: (id: string) => void;
  goBack: () => void;
}

export interface ModalContextType extends ModalState, ModalActions {
  isAnyModalOpen: boolean;
}