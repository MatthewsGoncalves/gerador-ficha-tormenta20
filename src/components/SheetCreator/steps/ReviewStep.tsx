import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Divider,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import { recalculateSheet } from '../utils/calculations';

interface ReviewStepProps {
  sheet: CharacterSheet;
  onComplete: (finalSheet: CharacterSheet) => void;
  onBack: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  sheet,
  onComplete,
  onBack,
}) => {
  const [finalSheet, setFinalSheet] = useState<CharacterSheet>(sheet);

  useEffect(() => {
    // Recalcular toda a ficha
    const recalculated = recalculateSheet(sheet);
    setFinalSheet(recalculated);
  }, [sheet]);

  const handleComplete = () => {
    onComplete(finalSheet);
  };

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Revisão da Ficha
      </Typography>

      <Alert severity='success' sx={{ mb: 3 }}>
        Revise as informações do seu personagem antes de finalizar. Todos os
        valores foram calculados automaticamente.
      </Alert>

      <Stack spacing={2}>
        {/* Informações Básicas */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom color='primary'>
            Informações Básicas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Nome
              </Typography>
              <Typography variant='h6'>{finalSheet.nome}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Sexo
              </Typography>
              <Typography variant='h6'>{finalSheet.sexo}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Raça
              </Typography>
              <Typography variant='h6'>{finalSheet.raca?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Classe
              </Typography>
              <Typography variant='h6'>{finalSheet.classe?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Nível
              </Typography>
              <Typography variant='h6'>{finalSheet.nivel}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Origem
              </Typography>
              <Typography variant='h6'>
                {finalSheet.origin?.name || 'Nenhuma'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Atributos */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom color='primary'>
            Atributos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {Object.entries(finalSheet.atributos).map(([key, attr]) => (
              <Grid item xs={6} sm={4} key={key}>
                <Typography variant='body2' color='text.secondary'>
                  {key}
                </Typography>
                <Typography variant='h6'>
                  {attr.value} ({attr.mod >= 0 ? '+' : ''}
                  {attr.mod})
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Combate */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom color='primary'>
            Atributos de Combate
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant='body2' color='text.secondary'>
                Pontos de Vida
              </Typography>
              <Typography variant='h5' color='success.main'>
                {finalSheet.pv}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant='body2' color='text.secondary'>
                Pontos de Mana
              </Typography>
              <Typography variant='h5' color='info.main'>
                {finalSheet.pm}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant='body2' color='text.secondary'>
                Defesa
              </Typography>
              <Typography variant='h5' color='warning.main'>
                {finalSheet.defesa}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant='body2' color='text.secondary'>
                Deslocamento
              </Typography>
              <Typography variant='h5'>{finalSheet.displacement}m</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Perícias */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom color='primary'>
            Perícias Treinadas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {finalSheet.skills.map((skill) => (
              <Chip key={skill} label={skill} color='primary' />
            ))}
            {finalSheet.skills.length === 0 && (
              <Typography variant='body2' color='text.secondary'>
                Nenhuma perícia selecionada
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Dinheiro */}
        {finalSheet.dinheiro !== undefined && finalSheet.dinheiro > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom color='primary'>
              Recursos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant='h5'>
              {finalSheet.dinheiro} T$ (Tibares)
            </Typography>
          </Paper>
        )}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} size='large'>
          Voltar
        </Button>
        <Button
          variant='contained'
          onClick={handleComplete}
          size='large'
          color='success'
        >
          Visualizar Ficha Completa
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewStep;


