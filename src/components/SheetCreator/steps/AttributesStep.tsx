import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  TextField,
  Alert,
  Grid,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import { Atributo } from '../../../data/atributos';
import {
  calculateAttributeMod,
  calculatePointBuyCost,
} from '../utils/calculations';

interface AttributesStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AttributesStep: React.FC<AttributesStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [attributes, setAttributes] = useState(sheet.atributos);
  const [pointsUsed, setPointsUsed] = useState(0);
  const maxPoints = 27;

  useEffect(() => {
    const total = Object.values(attributes).reduce(
      (sum, attr) => sum + calculatePointBuyCost(attr.value),
      0
    );
    setPointsUsed(total);
  }, [attributes]);

  const handleValueChange = (atributo: Atributo, newValue: number) => {
    const value = Math.max(8, Math.min(15, newValue));
    const mod = calculateAttributeMod(value);

    setAttributes({
      ...attributes,
      [atributo]: { name: atributo, value, mod },
    });
  };

  const handleNext = () => {
    // Aplicar bônus raciais
    const racialBonuses = sheet.raca?.attributes.attrs || [];
    const finalAttributes = { ...attributes };

    racialBonuses.forEach((bonus) => {
      if (bonus.attr !== 'any') {
        const attrKey = bonus.attr as Atributo;
        const currentValue = finalAttributes[attrKey].value;
        const newValue = currentValue + bonus.mod;
        finalAttributes[attrKey] = {
          name: attrKey,
          value: newValue,
          mod: calculateAttributeMod(newValue),
        };
      }
    });

    onUpdate({ atributos: finalAttributes });
    onNext();
  };

  const canProceed = pointsUsed <= maxPoints;
  const pointsRemaining = maxPoints - pointsUsed;

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Distribua seus Atributos
      </Typography>

      <Alert severity={pointsRemaining < 0 ? 'error' : 'info'} sx={{ mb: 3 }}>
        {pointsRemaining >= 0
          ? `Você tem ${maxPoints} pontos para distribuir. Restam: ${pointsRemaining} pontos`
          : `Você excedeu o limite em ${Math.abs(pointsRemaining)} pontos!`}
      </Alert>

      {sheet.raca && sheet.raca.attributes.attrs.length > 0 && (
        <Alert severity='success' sx={{ mb: 3 }}>
          Bônus raciais serão aplicados após a distribuição:
          {sheet.raca.attributes.attrs.map((attr, idx) => (
            <Typography key={idx} variant='caption' display='block'>
              • {attr.attr === 'any' ? 'Livre' : attr.attr} +{attr.mod}
            </Typography>
          ))}
        </Alert>
      )}

      <Grid container spacing={2}>
        {Object.keys(attributes).map((key) => {
          const atributo = key as Atributo;
          const attr = attributes[atributo];
          const cost = calculatePointBuyCost(attr.value);

          return (
            <Grid item xs={12} sm={6} key={atributo}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant='h6'>{atributo}</Typography>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <TextField
                      type='number'
                      value={attr.value}
                      onChange={(e) =>
                        handleValueChange(
                          atributo,
                          parseInt(e.target.value) || 8
                        )
                      }
                      inputProps={{ min: 8, max: 15 }}
                      sx={{ width: 80 }}
                      label='Valor'
                    />
                    <Box>
                      <Typography>
                        Modificador: {attr.mod >= 0 ? '+' : ''}
                        {attr.mod}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Custo: {cost} pontos
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Alert severity='info' sx={{ mt: 3 }}>
        <Typography variant='body2'>
          <strong>Sistema de Compra de Pontos:</strong>
        </Typography>
        <Typography variant='caption' display='block'>
          • Valores 8-13: cada ponto custa 1 ponto de compra
        </Typography>
        <Typography variant='caption' display='block'>
          • Valor 14: custa 7 pontos
        </Typography>
        <Typography variant='caption' display='block'>
          • Valor 15: custa 9 pontos
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} size='large'>
          Voltar
        </Button>
        <Button
          variant='contained'
          onClick={handleNext}
          disabled={!canProceed}
          size='large'
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default AttributesStep;

