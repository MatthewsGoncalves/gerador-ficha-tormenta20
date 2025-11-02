import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';

interface BasicInfoStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  sheet,
  onUpdate,
  onNext,
}) => {
  const [nome, setNome] = useState(sheet.nome);
  const [sexo, setSexo] = useState(sheet.sexo);
  const [nivel, setNivel] = useState(sheet.nivel);

  const handleNext = () => {
    onUpdate({ nome, sexo, nivel });
    onNext();
  };

  const canProceed = nome.trim() !== '' && sexo !== '';

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 3 }}>
        Dados Básicos do Personagem
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            label='Nome do Personagem'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            required
            helperText='Digite o nome do seu personagem'
            autoFocus
          />

          <FormControl fullWidth required>
            <InputLabel>Sexo/Gênero</InputLabel>
            <Select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              label='Sexo/Gênero'
            >
              <MenuItem value='Masculino'>Masculino</MenuItem>
              <MenuItem value='Feminino'>Feminino</MenuItem>
              <MenuItem value='Outro'>Outro</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Nível: {nivel}</Typography>
            <Slider
              value={nivel}
              onChange={(_, value) => setNivel(value as number)}
              min={1}
              max={20}
              marks
              valueLabelDisplay='auto'
              sx={{
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem',
                },
              }}
            />
            <Typography variant='caption' color='text.secondary'>
              Personagens geralmente começam no nível 1
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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

export default BasicInfoStep;

