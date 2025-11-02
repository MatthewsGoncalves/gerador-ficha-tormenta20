import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import CharacterSheet from '../../../interfaces/CharacterSheet';
import Skill from '../../../interfaces/Skills';

interface SkillsStepProps {
  sheet: CharacterSheet;
  onUpdate: (updates: Partial<CharacterSheet>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({
  sheet,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
    sheet.skills || []
  );
  const [mandatorySkills, setMandatorySkills] = useState<Skill[]>([]);

  useEffect(() => {
    // Processar perícias obrigatórias da classe
    const mandatory: Skill[] = [];

    if (sheet.classe?.periciasbasicas) {
      sheet.classe.periciasbasicas.forEach((basic) => {
        if (basic.type === 'and') {
          // Todas são obrigatórias
          mandatory.push(...basic.list);
        } else if (basic.type === 'or' && basic.list.length === 1) {
          // Se tem apenas uma opção no OR, é obrigatória
          mandatory.push(...basic.list);
        }
      });
    }

    setMandatorySkills(mandatory);

    // Adicionar perícias obrigatórias se ainda não estiverem
    const updatedSkills = [...selectedSkills];
    mandatory.forEach((skill) => {
      if (!updatedSkills.includes(skill)) {
        updatedSkills.push(skill);
      }
    });

    if (updatedSkills.length !== selectedSkills.length) {
      setSelectedSkills(updatedSkills);
    }
  }, [sheet.classe]);

  const handleSkillToggle = (skill: Skill) => {
    // Não permitir desmarcar perícias obrigatórias
    if (mandatorySkills.includes(skill)) return;

    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    onUpdate({ skills: selectedSkills });
    onNext();
  };

  const remainingQtd = sheet.classe?.periciasrestantes?.qtd || 0;
  const remainingList = sheet.classe?.periciasrestantes?.list || [];
  const selectedRemaining = selectedSkills.filter(
    (s) => !mandatorySkills.includes(s)
  );
  const canProceed = selectedRemaining.length === remainingQtd;

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Selecione suas Perícias
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        Você deve selecionar {remainingQtd} perícia(s) adicional(is).
        Selecionadas: {selectedRemaining.length} / {remainingQtd}
      </Alert>

      {mandatorySkills.length > 0 && (
        <>
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'success.light' }}>
            <Typography variant='h6' gutterBottom>
              Perícias Obrigatórias
            </Typography>
            <Stack spacing={1}>
              {mandatorySkills.map((skill) => (
                <FormControlLabel
                  key={skill}
                  control={<Checkbox checked disabled />}
                  label={skill}
                />
              ))}
            </Stack>
          </Paper>
        </>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant='h6' gutterBottom>
          Perícias Disponíveis
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {remainingList.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            const isMandatory = mandatorySkills.includes(skill);
            const isDisabled =
              !isSelected &&
              selectedRemaining.length >= remainingQtd &&
              !isMandatory;

            return (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleSkillToggle(skill)}
                    disabled={isMandatory || isDisabled}
                  />
                }
                label={skill}
                sx={{
                  opacity: isDisabled ? 0.5 : 1,
                }}
              />
            );
          })}
        </Stack>
      </Paper>

      {!canProceed && (
        <Alert severity='warning' sx={{ mt: 2 }}>
          {selectedRemaining.length < remainingQtd
            ? `Você ainda precisa selecionar ${
                remainingQtd - selectedRemaining.length
              } perícia(s)`
            : `Você selecionou ${
                selectedRemaining.length - remainingQtd
              } perícia(s) a mais`}
        </Alert>
      )}

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

export default SkillsStep;

