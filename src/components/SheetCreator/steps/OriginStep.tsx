import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import ORIGINS from '../../../data/origins';
import Origin from '../../../interfaces/Origin';

interface OriginStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OriginStep: React.FC<OriginStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(
    sheet.origin
      ? Object.values(ORIGINS).find((o) => o.name === sheet.origin?.name) ||
          null
      : null
  );

  const handleOriginSelect = (origin: Origin) => {
    setSelectedOrigin(origin);
  };

  const handleNext = () => {
    if (selectedOrigin) {
      onUpdate({
        origin: {
          name: selectedOrigin.name,
          powers: selectedOrigin.poderes,
        },
      });
      onNext();
    }
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Escolha sua Origem
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        A origem representa o passado do seu personagem e concede perícias e
        equipamentos iniciais.
      </Alert>

      <Grid container spacing={2}>
        {Object.values(ORIGINS).map((origin) => (
          <Grid item xs={12} sm={6} md={4} key={origin.name}>
            <Card
              sx={{
                border:
                  selectedOrigin?.name === origin.name
                    ? '2px solid #d13235'
                    : '1px solid #ddd',
                height: '100%',
              }}
            >
              <CardActionArea
                onClick={() => handleOriginSelect(origin)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant='h6' gutterBottom color='primary'>
                    {origin.name}
                  </Typography>

                  {origin.pericias && origin.pericias.length > 0 && (
                    <>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        <strong>Perícias:</strong>
                      </Typography>
                      <Stack
                        direction='row'
                        spacing={0.5}
                        flexWrap='wrap'
                        sx={{ mb: 2 }}
                      >
                        {origin.pericias.slice(0, 3).map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size='small'
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                        {origin.pericias.length > 3 && (
                          <Chip
                            label={`+${origin.pericias.length - 3}`}
                            size='small'
                            color='primary'
                          />
                        )}
                      </Stack>
                    </>
                  )}

                  {origin.poderes && origin.poderes.length > 0 && (
                    <Typography variant='caption' color='primary'>
                      {origin.poderes.length} poder(es) de origem
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
          disabled={!selectedOrigin}
          size='large'
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default OriginStep;

