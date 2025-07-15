import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { ModalContextType, ModalConfig, ModalState, ModalActions } from './ModalTypes';

type ModalAction =
  | { type: 'OPEN_MODAL'; payload: Omit<ModalConfig, 'isOpen'> }
  | { type: 'CLOSE_MODAL'; payload: string }
  | { type: 'CLOSE_ALL_MODALS' }
  | { type: 'UPDATE_MODAL'; payload: { id: string; updates: Partial<ModalConfig> } }
  | { type: 'NAVIGATE_TO_MODAL'; payload: string }
  | { type: 'GO_BACK' };

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL': {
      const existingIndex = state.modals.findIndex(m => m.id === action.payload.id);
      
      if (existingIndex !== -1) {
        // Update existing modal
        const updatedModals = [...state.modals];
        updatedModals[existingIndex] = { ...updatedModals[existingIndex], ...action.payload, isOpen: true };
        return {
          ...state,
          modals: updatedModals,
          activeModalId: action.payload.id,
          history: [...state.history, action.payload.id]
        };
      }
      
      // Add new modal
      const newModal: ModalConfig = { ...action.payload, isOpen: true };
      return {
        ...state,
        modals: [...state.modals, newModal],
        activeModalId: action.payload.id,
        history: [...state.history, action.payload.id]
      };
    }
    
    case 'CLOSE_MODAL': {
      const modalToClose = state.modals.find(m => m.id === action.payload);
      if (!modalToClose || modalToClose.persistent) {
        return state;
      }
      
      const updatedModals = state.modals.map(modal =>
        modal.id === action.payload ? { ...modal, isOpen: false } : modal
      );
      
      const newHistory = state.history.filter(id => id !== action.payload);
      const newActiveModalId = newHistory[newHistory.length - 1] || undefined;
      
      return {
        ...state,
        modals: updatedModals,
        activeModalId: newActiveModalId,
        history: newHistory
      };
    }
    
    case 'CLOSE_ALL_MODALS': {
      const updatedModals = state.modals.map(modal =>
        modal.persistent ? modal : { ...modal, isOpen: false }
      );
      
      return {
        ...state,
        modals: updatedModals,
        activeModalId: undefined,
        history: []
      };
    }
    
    case 'UPDATE_MODAL': {
      const updatedModals = state.modals.map(modal =>
        modal.id === action.payload.id 
          ? { ...modal, ...action.payload.updates }
          : modal
      );
      
      return {
        ...state,
        modals: updatedModals
      };
    }
    
    case 'NAVIGATE_TO_MODAL': {
      return {
        ...state,
        activeModalId: action.payload,
        history: [...state.history, action.payload]
      };
    }
    
    case 'GO_BACK': {
      const newHistory = state.history.slice(0, -1);
      const newActiveModalId = newHistory[newHistory.length - 1] || undefined;
      
      return {
        ...state,
        activeModalId: newActiveModalId,
        history: newHistory
      };
    }
    
    default:
      return state;
  }
};

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const EnhancedModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, {
    modals: [],
    activeModalId: undefined,
    history: []
  });

  const actions = useMemo<ModalActions>(() => ({
    openModal: (config) => {
      dispatch({ type: 'OPEN_MODAL', payload: config });
    },
    
    closeModal: (id) => {
      dispatch({ type: 'CLOSE_MODAL', payload: id });
    },
    
    closeAllModals: () => {
      dispatch({ type: 'CLOSE_ALL_MODALS' });
    },
    
    updateModal: (id, updates) => {
      dispatch({ type: 'UPDATE_MODAL', payload: { id, updates } });
    },
    
    navigateToModal: (id) => {
      dispatch({ type: 'NAVIGATE_TO_MODAL', payload: id });
    },
    
    goBack: () => {
      dispatch({ type: 'GO_BACK' });
    }
  }), []);

  const contextValue = useMemo<ModalContextType>(() => ({
    ...state,
    ...actions,
    isAnyModalOpen: state.modals.some(modal => modal.isOpen)
  }), [state, actions]);

  // Cleanup closed modals after animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const hasClosedModals = state.modals.some(modal => !modal.isOpen);
      if (hasClosedModals) {
        const activeModals = state.modals.filter(modal => modal.isOpen || modal.persistent);
        if (activeModals.length !== state.modals.length) {
          dispatch({ 
            type: 'UPDATE_MODAL', 
            payload: { 
              id: 'cleanup', 
              updates: {} 
            }
          });
        }
      }
    }, 300); // Wait for animation to complete

    return () => clearTimeout(timer);
  }, [state.modals]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Helper hooks for common modal operations
export const useModalActions = () => {
  const { openModal, closeModal, closeAllModals, updateModal } = useModal();
  return { openModal, closeModal, closeAllModals, updateModal };
};

export const useModalState = () => {
  const { modals, activeModalId, isAnyModalOpen, history } = useModal();
  return { modals, activeModalId, isAnyModalOpen, history };
};