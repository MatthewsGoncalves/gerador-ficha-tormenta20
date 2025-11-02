import React from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';

interface SpellsStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SpellsStep: React.FC<SpellsStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const hasSpellPath = sheet.classe?.spellPath !== undefined;

  const handleSkip = () => {
    onUpdate({ spells: [] });
    onNext();
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Magias
      </Typography>

      {hasSpellPath ? (
        <>
          <Alert severity='info' sx={{ mb: 3 }}>
            Sua classe é conjuradora! A seleção de magias será implementada em
            breve. Por enquanto, você pode pular este passo.
          </Alert>
          <Typography variant='body1' sx={{ mb: 3 }}>
            Classes conjuradoras podem aprender e lançar magias. O sistema de
            seleção de magias por círculo e escola estará disponível em breve.
          </Typography>
        </>
      ) : (
        <Alert severity='info' sx={{ mb: 3 }}>
          Sua classe não é conjuradora, então você não aprende magias
          automaticamente.
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} size='large'>
          Voltar
        </Button>
        <Button variant='contained' onClick={handleSkip} size='large'>
          {hasSpellPath ? 'Pular' : 'Próximo'}
        </Button>
      </Box>
    </Box>
  );
};

export default SpellsStep;


