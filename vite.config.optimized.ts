/**
 * Configuration Vite optimisée pour dalil.dz
 * Implémente le code splitting et les optimisations de performance
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optimisations pour le développement
  server: {
    hmr: {
      overlay: false // Réduire les overlays d'erreur intrusifs
    }
  },

  // Optimisations de build pour la production
  build: {
    // Taille limite des chunks augmentée car on gère manuellement
    chunkSizeWarningLimit: 1000,
    
    // Optimisation de la minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer tous les console.log en production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn', 'console.info'] // Fonctions à supprimer
      },
      mangle: {
        safari10: true // Support Safari
      }
    },

    rollupOptions: {
      output: {
        // Code splitting manuel pour optimiser les performances
        manualChunks: (id) => {
          // Vendor chunks - Bibliothèques externes
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            
            // UI Libraries - RadixUI + Lucide
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            
            // Charts and visualization
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            
            // AI and processing libraries
            if (id.includes('tesseract') || id.includes('pdf-poppler')) {
              return 'vendor-ai';
            }
            
            // Form and validation
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'vendor-forms';
            }
            
            // Date and utility libraries
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }
            
            // Supabase and data
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'vendor-data';
            }
            
            // Security libraries
            if (id.includes('dompurify')) {
              return 'vendor-security';
            }
            
            // Autre vendor
            return 'vendor-misc';
          }

          // Application chunks - Par fonctionnalité
          
          // Legal texts functionality
          if (id.includes('src/components/legal') || 
              id.includes('src/components/LegalTextsSections') ||
              id.includes('src/components/LegalTextFormEnhanced')) {
            return 'app-legal';
          }
          
          // Procedures functionality
          if (id.includes('src/components/procedures') || 
              id.includes('src/components/ProceduresSections') ||
              id.includes('src/components/ProcedureForm') ||
              id.includes('src/components/forms/procedure')) {
            return 'app-procedures';
          }
          
          // Analysis and analytics
          if (id.includes('src/components/analysis') || 
              id.includes('src/components/analytics') ||
              id.includes('src/components/AnalysisReportsSections')) {
            return 'app-analysis';
          }
          
          // AI functionality
          if (id.includes('src/components/ai') || 
              id.includes('src/components/AILegalAssistant')) {
            return 'app-ai';
          }
          
          // Administration and configuration
          if (id.includes('src/components/admin') || 
              id.includes('src/components/configuration') ||
              id.includes('src/components/ConfigurationSections')) {
            return 'app-admin';
          }
          
          // Search functionality
          if (id.includes('src/components/search') || 
              id.includes('src/components/AdvancedSearchSection') ||
              id.includes('src/components/saved-searches')) {
            return 'app-search';
          }
          
          // Collaboration features
          if (id.includes('src/components/collaboration') || 
              id.includes('src/components/CollaborationSections')) {
            return 'app-collaboration';
          }
          
          // Help and documentation
          if (id.includes('src/components/help') || 
              id.includes('src/components/docs') ||
              id.includes('src/components/HelpSections')) {
            return 'app-help';
          }
          
          // News and references
          if (id.includes('src/components/news-references') || 
              id.includes('src/components/NewsReferencesSections')) {
            return 'app-news';
          }
          
          // Modals - Séparé car chargé à la demande
          if (id.includes('src/components/modals')) {
            return 'app-modals';
          }
          
          // Core utilities
          if (id.includes('src/utils') || 
              id.includes('src/hooks') ||
              id.includes('src/services')) {
            return 'app-core';
          }
          
          // Types et intégrations
          if (id.includes('src/types') || 
              id.includes('src/integrations')) {
            return 'app-types';
          }
          
          // Main app chunk pour le reste
          return 'app-main';
        },
        
        // Nommage des chunks avec hash pour le cache
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop() 
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        
        // Assets avec hash
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|gif|svg|ico|webp/.test(ext)) {
            return `images/[name]-[hash].${ext}`;
          }
          
          if (/css/.test(ext)) {
            return `css/[name]-[hash].${ext}`;
          }
          
          return `assets/[name]-[hash].${ext}`;
        },
        
        // Entry points
        entryFileNames: 'js/[name]-[hash].js',
      },
      
      // Optimisation des imports externes
      external: (id) => {
        // Exclure les polyfills lourds qui ne sont pas nécessaires
        return false;
      }
    },
    
    // Source maps pour le debugging en production (optionnel)
    sourcemap: false, // Désactivé pour la performance
    
    // Optimisations CSS
    cssCodeSplit: true,
    cssMinify: true,
  },

  // Optimisations spécifiques à l'environnement
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    
    // Supprimer les console.log conditionnellement
    'console.log': process.env.NODE_ENV === 'production' ? '(() => {})' : 'console.log',
    'console.warn': process.env.NODE_ENV === 'production' ? '(() => {})' : 'console.warn',
    'console.info': process.env.NODE_ENV === 'production' ? '(() => {})' : 'console.info',
  },

  // Optimisations de cache
  optimizeDeps: {
    include: [
      // Pré-bundler les dépendances lourdes
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'lucide-react',
      'date-fns',
      'zod'
    ],
    exclude: [
      // Exclure les modules qui causent des problèmes
      'tesseract.js' // Lazy load uniquement
    ]
  },

  // Configuration du worker (pour les Web Workers)
  worker: {
    format: 'es',
    plugins: [react()]
  }
});

/**
 * Configuration d'exemple pour les variables d'environnement de performance
 * 
 * .env.production:
 * VITE_ENABLE_ANALYTICS=true
 * VITE_PERFORMANCE_MONITORING=true
 * VITE_LOG_LEVEL=error
 * 
 * .env.development:
 * VITE_ENABLE_ANALYTICS=false
 * VITE_PERFORMANCE_MONITORING=true
 * VITE_LOG_LEVEL=debug
 */