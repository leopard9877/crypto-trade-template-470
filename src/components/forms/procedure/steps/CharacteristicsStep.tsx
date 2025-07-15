/**
 * Composant pour l'étape "Caractéristiques" du formulaire de procédure
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FormStepProps, DIFFICULTY_LEVELS, DURATION_OPTIONS, COST_RANGES } from '../ProcedureFormTypes';

export const CharacteristicsStep: React.FC<FormStepProps> = ({
  data,
  onChange,
  errors
}) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  const getDifficultyColor = (difficulty: string) => {
    const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty);
    return level?.color || 'gray';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Caractéristiques de la procédure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Niveau de difficulté */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Niveau de difficulté <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={data.difficulty || ''}
            onValueChange={(value) => handleInputChange('difficulty', value)}
            className="grid grid-cols-2 gap-4"
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={level.value} />
                <Label 
                  htmlFor={level.value} 
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span>{level.label}</span>
                  <Badge 
                    variant="outline" 
                    className={`border-${level.color}-500 text-${level.color}-700`}
                  >
                    {level.label}
                  </Badge>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.difficulty && (
            <p className="text-sm text-red-500">{errors.difficulty}</p>
          )}
        </div>

        {/* Durée et Coût */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration">
              Durée estimée <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.duration || ''}
              onValueChange={(value) => handleInputChange('duration', value)}
            >
              <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner la durée" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">
              Coût estimé <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.cost || ''}
              onValueChange={(value) => handleInputChange('cost', value)}
            >
              <SelectTrigger className={errors.cost ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner le coût" />
              </SelectTrigger>
              <SelectContent>
                {COST_RANGES.map((cost) => (
                  <SelectItem key={cost} value={cost}>
                    {cost}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cost && (
              <p className="text-sm text-red-500">{errors.cost}</p>
            )}
          </div>
        </div>

        {/* Aperçu visuel */}
        {data.difficulty && data.duration && data.cost && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Aperçu</h4>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={`border-${getDifficultyColor(data.difficulty)}-500 text-${getDifficultyColor(data.difficulty)}-700`}
              >
                {DIFFICULTY_LEVELS.find(l => l.value === data.difficulty)?.label}
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-700">
                {data.duration}
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-700">
                {data.cost}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};