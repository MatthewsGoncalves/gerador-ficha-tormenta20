import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { v4 as uuid } from 'uuid';
import CharacterSheet from '../../interfaces/CharacterSheet';
import Bag from '../../interfaces/Bag';
import { Atributo } from '../../data/atributos';
import RACAS from '../../data/racas';
import CLASSES from '../../data/classes';
import Result from '../SheetResult/Result';
import {
  getRaceDisplacement,
  getRaceSize,
} from '../../data/races/functions/functions';
import { recalculateSheet } from './utils/calculations';

interface InteractiveSheetProps {
  isDarkMode?: boolean;
}

const InteractiveSheet: React.FC<InteractiveSheetProps> = ({
  isDarkMode = false,
}) => {
  const [sheet] = useState<CharacterSheet>(() => {
    // Criar ficha inicial com valores padrão
    const defaultRace = RACAS[0]; // Primeira raça
    const defaultClass = CLASSES[0]; // Primeira classe

    return {
      id: uuid(),
      nome: 'Novo Personagem',
      sexo: 'Masculino',
      nivel: 1,
      atributos: {
        Força: { name: Atributo.FORCA, mod: 0, value: 10 },
        Destreza: { name: Atributo.DESTREZA, mod: 0, value: 10 },
        Constituição: { name: Atributo.CONSTITUICAO, mod: 0, value: 10 },
        Inteligência: { name: Atributo.INTELIGENCIA, mod: 0, value: 10 },
        Sabedoria: { name: Atributo.SABEDORIA, mod: 0, value: 10 },
        Carisma: { name: Atributo.CARISMA, mod: 0, value: 10 },
      },
      raca: defaultRace,
      classe: defaultClass,
      skills: [],
      pv: defaultClass.pv,
      pm: defaultClass.pm,
      sheetBonuses: [],
      sheetActionHistory: [],
      defesa: 10,
      bag: new Bag(),
      devoto: undefined,
      origin: undefined,
      spells: [],
      displacement: getRaceDisplacement(defaultRace),
      size: getRaceSize(defaultRace),
      maxSpaces: 10,
      generalPowers: [],
      classPowers: [],
      steps: [],
      extraArmorPenalty: 0,
      completeSkills: [],
      sentidos: [],
      dinheiro: 0,
    };
  });

  // Recalcular ficha sempre que houver mudanças
  const finalSheet = useMemo(() => {
    return recalculateSheet(sheet);
  }, [sheet]);

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 3 } }}>
      {/* Ficha Completa */}
      <Result sheet={finalSheet} isDarkMode={isDarkMode} />
    </Box>
  );
};

export default InteractiveSheet;
