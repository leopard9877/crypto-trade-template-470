/**
 * Composant pour l'étape "Informations de base" du formulaire de procédure
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormStepProps, PROCEDURE_CATEGORIES, ORGANIZATIONS } from '../ProcedureFormTypes';

export const BasicInfoStep: React.FC<FormStepProps> = ({
  data,
  onChange,
  errors
}) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de base</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Titre */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Titre de la procédure <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Demande de permis de construire"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Décrivez brièvement cette procédure administrative..."
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Catégorie et Institution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">
              Catégorie <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.category || ''}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {PROCEDURE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">
              Institution responsable <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.institution || ''}
              onValueChange={(value) => handleInputChange('institution', value)}
            >
              <SelectTrigger className={errors.institution ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner une institution" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATIONS.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.institution && (
              <p className="text-sm text-red-500">{errors.institution}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};