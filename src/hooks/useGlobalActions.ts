
import { useModals } from '@/hooks/useModals';
import { useToast } from '@/hooks/use-toast';

export function useGlobalActions() {
  const { openModal, closeModal, closeAllModals } = useModals();
  const { toast } = useToast();

  const actions = {
    // Modal actions
    handlePDFView: (title: string, pdfUrl?: string) => {
      openModal('pdfViewer', { data: { title, pdfUrl } });
    },

    handleComparison: (items: any[]) => {
      openModal('comparison', { data: items });
    },

    handleFilter: (type: 'legal' | 'procedure' | 'general' = 'general') => {
      openModal('filter', { type });
    },

    handleFeedback: (type: 'error' | 'feedback' | 'testimonial', itemTitle?: string) => {
      openModal('feedback', { type, itemTitle });
    },

    handleExport: (data: any[], filename?: string) => {
      openModal('export', { data, filename });
    },

    handleImport: (acceptedTypes: string[] = ['.csv', '.xlsx', '.json']) => {
      openModal('import', { acceptedTypes });
    },

    handleAdvancedSearch: () => {
      openModal('advancedSearch');
    },

    handleAnalysis: (type: 'comparative' | 'performance' | 'trends', data: any[] = []) => {
      openModal('analysis', { type, data });
    },

    handleManagement: (type: 'domain' | 'textType' | 'category' | 'organization' | 'source' | 'role' | 'permission' | 'policy') => {
      openModal('management', { type });
    },

    // User actions
    handleLike: (itemId: string, itemTitle: string) => {
      toast({
        title: "Ajouté aux favoris",
        description: `"${itemTitle}" a été ajouté à vos favoris.`,
      });
    },

    handleShare: async (title: string, url?: string) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text: `Consultez: ${title}`,
            url: url || window.location.href
          });
          toast({
            title: "Partagé avec succès",
            description: "Le lien a été partagé.",
          });
        } catch (error) {
          console.log('Partage annulé');
        }
      } else {
        navigator.clipboard.writeText(url || window.location.href);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers.",
        });
      }
    },

    handleDownload: (filename: string, url?: string) => {
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      }
      toast({
        title: "Téléchargement démarré",
        description: `Le fichier ${filename} est en cours de téléchargement.`,
      });
    },

    // Workflow actions
    handleApprove: (itemId: string, itemTitle: string) => {
      toast({
        title: "Élément approuvé",
        description: `"${itemTitle}" a été approuvé avec succès.`,
      });
    },

    handleReject: (itemId: string, itemTitle: string) => {
      toast({
        title: "Élément rejeté",
        description: `"${itemTitle}" a été rejeté.`,
      });
    },

    handleExamine: (itemId: string, itemTitle: string) => {
      toast({
        title: "Examen en cours",
        description: `"${itemTitle}" est maintenant en cours d'examen.`,
      });
    },

    // Navigation actions
    handleGeolocationSearch: () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            openModal('geolocationSearch', { 
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            });
          },
          () => {
            toast({
              title: "Géolocalisation non disponible",
              description: "Impossible d'accéder à votre position.",
              variant: "destructive"
            });
          }
        );
      }
    },

    handleClose: (modalId?: string) => {
      if (modalId) {
        closeModal(modalId as any);
      } else {
        closeAllModals();
      }
    }
  };

  return actions;
}
