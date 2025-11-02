import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import CLASSES from '../../../data/classes';
import { ClassDescription } from '../../../interfaces/Class';

interface ClassSelectionStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ClassSelectionStep: React.FC<ClassSelectionStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassDescription | null>(
    sheet.classe
  );

  const handleClassSelect = (classe: ClassDescription) => {
    setSelectedClass(classe);
  };

  const handleNext = () => {
    if (selectedClass) {
      // Aplicar setup da classe se existir
      let finalClass = selectedClass;
      if (selectedClass.setup) {
        finalClass = selectedClass.setup(selectedClass);
      }

      onUpdate({
        classe: finalClass,
      });
      onNext();
    }
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Escolha sua Classe
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        A classe define suas habilidades de combate, perícias e poderes
        especiais.
      </Alert>

      <Grid container spacing={2}>
        {CLASSES.map((classe) => (
          <Grid item xs={12} sm={6} md={4} key={classe.name}>
            <Card
              sx={{
                border:
                  selectedClass?.name === classe.name
                    ? '2px solid #d13235'
                    : '1px solid #ddd',
                height: '100%',
              }}
            >
              <CardActionArea
                onClick={() => handleClassSelect(classe)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant='h6' gutterBottom color='primary'>
                    {classe.name}
                    {classe.subname && (
                      <Typography
                        component='span'
                        variant='caption'
                        sx={{ ml: 1 }}
                      >
                        ({classe.subname})
                      </Typography>
                    )}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant='body2'>
                      <strong>PV:</strong> {classe.pv} (+{classe.addpv}/nível)
                    </Typography>
                    <Typography variant='body2'>
                      <strong>PM:</strong> {classe.pm} (+{classe.addpm}/nível)
                    </Typography>
                  </Stack>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1 }}
                  >
                    <strong>Proficiências:</strong>
                  </Typography>
                  <Box>
                    {classe.proficiencias.slice(0, 3).map((prof, idx) => (
                      <Chip
                        key={idx}
                        label={prof}
                        size='small'
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    {classe.proficiencias.length > 3 && (
                      <Chip
                        label={`+${classe.proficiencias.length - 3}`}
                        size='small'
                        color='primary'
                      />
                    )}
                  </Box>

                  {classe.spellPath && (
                    <Typography
                      variant='caption'
                      color='primary'
                      display='block'
                      sx={{ mt: 1 }}
                    >
                      ✨ Classe conjuradora
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} size='large'>
          Voltar
        </Button>
        <Button
          variant='contained'
          onClick={handleNext}
          disabled={!selectedClass}
          size='large'
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default ClassSelectionStep;

