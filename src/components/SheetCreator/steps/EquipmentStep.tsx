import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper, Stack } from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import { calculateInitialMoney } from '../utils/calculations';

interface EquipmentStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [initialMoney] = useState(() => {
    return sheet.dinheiro || calculateInitialMoney(sheet.nivel);
  });

  const handleNext = () => {
    onUpdate({ dinheiro: initialMoney });
    onNext();
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Equipamentos
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        O sistema de compra de equipamentos será implementado em breve. Por
        enquanto, seu personagem receberá o dinheiro inicial.
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant='h6'>Dinheiro Inicial</Typography>
          <Typography variant='h4' color='primary'>
            {initialMoney} T$ (Tibares)
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Baseado no nível {sheet.nivel}
          </Typography>
        </Stack>
      </Paper>

      <Typography variant='body1' sx={{ mb: 3 }}>
        Com este dinheiro, você poderá comprar armas, armaduras e outros
        equipamentos. O sistema completo de compras estará disponível em breve.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} size='large'>
          Voltar
        </Button>
        <Button variant='contained' onClick={handleNext} size='large'>
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default EquipmentStep;


