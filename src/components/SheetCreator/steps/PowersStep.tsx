import React from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';

interface PowersStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PowersStep: React.FC<PowersStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleSkip = () => {
    onUpdate({ generalPowers: [], classPowers: [] });
    onNext();
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Poderes
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        A seleção de poderes gerais e de classe será implementada em breve. Por
        enquanto, você pode pular este passo.
      </Alert>

      <Typography variant='body1' sx={{ mb: 3 }}>
        Personagens ganham poderes gerais conforme sobem de nível, e também
        podem escolher poderes específicos de sua classe. Esta funcionalidade
        estará disponível em breve.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} size='large'>
          Voltar
        </Button>
        <Button variant='contained' onClick={handleSkip} size='large'>
          Pular
        </Button>
      </Box>
    </Box>
  );
};

export default PowersStep;


