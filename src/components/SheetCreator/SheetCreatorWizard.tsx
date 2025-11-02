import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import CharacterSheet from '../../interfaces/CharacterSheet';
import Bag from '../../interfaces/Bag';
import { Atributo } from '../../data/atributos';
import { RACE_SIZES } from '../../data/races/raceSizes/raceSizes';
import Result from '../SheetResult/Result';

// Import dos passos do wizard
import BasicInfoStep from './steps/BasicInfoStep';
import RaceSelectionStep from './steps/RaceSelectionStep';
import ClassSelectionStep from './steps/ClassSelectionStep';
import AttributesStep from './steps/AttributesStep';
import SkillsStep from './steps/SkillsStep';
import OriginStep from './steps/OriginStep';
import PowersStep from './steps/PowersStep';
import SpellsStep from './steps/SpellsStep';
import EquipmentStep from './steps/EquipmentStep';
import ReviewStep from './steps/ReviewStep';

interface SheetCreatorWizardProps {
  isDarkMode?: boolean;
}

const steps = [
  'Dados Básicos',
  'Raça',
  'Classe',
  'Atributos',
  'Perícias',
  'Origem',
  'Poderes',
  'Magias',
  'Equipamentos',
  'Revisão',
];

const SheetCreatorWizard: React.FC<SheetCreatorWizardProps> = ({
  isDarkMode = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSheet, setCompletedSheet] = useState<CharacterSheet | null>(
    null
  );
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet>({
    id: uuid(),
    nome: '',
    sexo: '',
    nivel: 1,
    atributos: {
      Força: { name: Atributo.FORCA, mod: 0, value: 10 },
      Destreza: { name: Atributo.DESTREZA, mod: 0, value: 10 },
      Constituição: { name: Atributo.CONSTITUICAO, mod: 0, value: 10 },
      Inteligência: { name: Atributo.INTELIGENCIA, mod: 0, value: 10 },
      Sabedoria: { name: Atributo.SABEDORIA, mod: 0, value: 10 },
      Carisma: { name: Atributo.CARISMA, mod: 0, value: 10 },
    },
    raca: null as any,
    classe: null as any,
    skills: [],
    pv: 0,
    pm: 0,
    sheetBonuses: [],
    sheetActionHistory: [],
    defesa: 10,
    bag: new Bag(),
    devoto: undefined,
    origin: undefined,
    spells: [],
    displacement: 9,
    size: RACE_SIZES.MEDIO,
    maxSpaces: 10,
    generalPowers: [],
    classPowers: [],
    steps: [],
    extraArmorPenalty: 0,
    completeSkills: [],
    sentidos: [],
    dinheiro: 0,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpdateSheet = (updates: Partial<CharacterSheet>) => {
    setCharacterSheet((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = (finalSheet: CharacterSheet) => {
    setCompletedSheet(finalSheet);
    setShowSaveDialog(true);
  };

  const handleSaveAndView = () => {
    if (completedSheet) {
      const historic = JSON.parse(localStorage.getItem('fdnHistoric') || '[]');
      historic.push(completedSheet);
      localStorage.setItem('fdnHistoric', JSON.stringify(historic));
      setShowSaveDialog(false);
    }
  };

  const handleViewOnly = () => {
    setShowSaveDialog(false);
  };

  const handleGoToSheets = () => {
    history.push('/sheets');
  };

  // Se a ficha foi completada, mostrar o resultado
  if (completedSheet && !showSaveDialog) {
    return (
      <Box>
        <Result sheet={completedSheet} isDarkMode={isDarkMode} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 3,
            p: 2,
          }}
        >
          <Button variant='outlined' onClick={() => history.push('/')}>
            Voltar ao Início
          </Button>
          <Button variant='contained' onClick={handleGoToSheets}>
            Ver Minhas Fichas
          </Button>
        </Box>
      </Box>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <RaceSelectionStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <ClassSelectionStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <AttributesStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <SkillsStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <OriginStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <PowersStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 7:
        return (
          <SpellsStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 8:
        return (
          <EquipmentStep
            sheet={characterSheet}
            onUpdate={handleUpdateSheet}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 9:
        return (
          <ReviewStep
            sheet={characterSheet}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return <Typography>Passo desconhecido</Typography>;
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', p: isMobile ? 1 : 3 }}>
        <Card sx={{ p: isMobile ? 2 : 3 }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{ mb: 3, textAlign: 'center', fontFamily: 'Tfont' }}
          >
            Criador de Ficha - Tormenta 20
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{ mb: 4 }}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2, minHeight: '400px' }}>
            {renderStepContent(activeStep)}
          </Box>
        </Card>
      </Box>

      {/* Dialog de confirmação de salvamento */}
      <Dialog open={showSaveDialog} onClose={handleViewOnly}>
        <DialogTitle>Salvar Ficha?</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja salvar esta ficha no seu histórico de personagens?
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            {completedSheet?.nome} - Nível {completedSheet?.nivel}{' '}
            {completedSheet?.raca?.name} {completedSheet?.classe?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewOnly}>Apenas Visualizar</Button>
          <Button onClick={handleSaveAndView} variant='contained'>
            Salvar e Visualizar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SheetCreatorWizard;
