import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Alert,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import RACAS from '../../../data/racas';
import Race from '../../../interfaces/Race';

interface RaceSelectionStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const RaceSelectionStep: React.FC<RaceSelectionStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(sheet.raca);

  const handleRaceSelect = (race: Race) => {
    setSelectedRace(race);
  };

  const handleNext = () => {
    if (selectedRace) {
      // Aplicar setup da raça se existir
      let finalRace = selectedRace;
      if (selectedRace.setup) {
        finalRace = selectedRace.setup(selectedRace, RACAS);
      }

      onUpdate({ raca: finalRace });
      onNext();
    }
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Escolha sua Raça
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        A raça do seu personagem define bônus de atributos, habilidades raciais
        e outras características especiais.
      </Alert>

      <Grid container spacing={2}>
        {RACAS.map((race) => (
          <Grid item xs={12} sm={6} md={4} key={race.name}>
            <Card
              sx={{
                border:
                  selectedRace?.name === race.name
                    ? '2px solid #d13235'
                    : '1px solid #ddd',
                height: '100%',
              }}
            >
              <CardActionArea
                onClick={() => handleRaceSelect(race)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant='h6' gutterBottom color='primary'>
                    {race.name}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1 }}
                  >
                    <strong>Bônus de Atributos:</strong>
                  </Typography>
                  <Stack
                    direction='row'
                    spacing={0.5}
                    flexWrap='wrap'
                    sx={{ mb: 2 }}
                  >
                    {race.attributes.attrs.map((attr, idx) => (
                      <Chip
                        key={idx}
                        label={`${attr.attr === 'any' ? 'Livre' : attr.attr} +${
                          attr.mod
                        }`}
                        size='small'
                        color='primary'
                        variant='outlined'
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </Stack>

                  {race.abilities && race.abilities.length > 0 && (
                    <>
                      <Typography variant='body2' color='text.secondary'>
                        <strong>Habilidades:</strong>
                      </Typography>
                      {race.abilities.slice(0, 2).map((ability, idx) => (
                        <Typography
                          key={idx}
                          variant='caption'
                          display='block'
                          sx={{ mb: 0.5 }}
                        >
                          • {ability.name}
                        </Typography>
                      ))}
                      {race.abilities.length > 2 && (
                        <Typography variant='caption' color='text.secondary'>
                          + {race.abilities.length - 2} outras habilidades
                        </Typography>
                      )}
                    </>
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
          disabled={!selectedRace}
          size='large'
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default RaceSelectionStep;

