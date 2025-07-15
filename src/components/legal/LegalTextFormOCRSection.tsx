
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, FileImage } from 'lucide-react';
import { OCRScanner } from '@/components/common/OCRScanner';

interface LegalTextFormOCRSectionProps {
  showOCRScanner: boolean;
  onShowOCRScanner: (show: boolean) => void;
  onOCRTextExtracted: (text: string) => void;
}

export function LegalTextFormOCRSection({ 
  showOCRScanner, 
  onShowOCRScanner, 
  onOCRTextExtracted 
}: LegalTextFormOCRSectionProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-green-600" />
          Scanner pour Générer un Texte Juridique
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!showOCRScanner ? (
          <div className="text-center py-8">
            <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Scanner un Document</h4>
            <p className="text-gray-600 mb-4">
              Utilisez l'OCR pour extraire automatiquement le contenu de votre document juridique
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button 
                onClick={() => onShowOCRScanner(true)} 
                className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col gap-1"
              >
                <FileImage className="w-5 h-5" />
                <span>Importer un fichier</span>
                <span className="text-xs opacity-80">Images ou PDF</span>
              </Button>
              <Button 
                onClick={() => onShowOCRScanner(true)} 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 h-16 flex flex-col gap-1"
              >
                <Scan className="w-5 h-5" />
                <span>Prendre une photo</span>
              </Button>
            </div>
          </div>
        ) : (
          <OCRScanner
            onTextExtracted={onOCRTextExtracted}
            onClose={() => onShowOCRScanner(false)}
            title="Scanner pour Générer un Texte Juridique"
          />
        )}
      </CardContent>
    </Card>
  );
}
