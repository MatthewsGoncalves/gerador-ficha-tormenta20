import CharacterSheet from '../../../interfaces/CharacterSheet';
import { ClassDescription } from '../../../interfaces/Class';
import { Atributo } from '../../../data/atributos';
import Skill, { CompleteSkill } from '../../../interfaces/Skills';
import { SkillsAttrs } from '../../../interfaces/Skills';

/**
 * Calcula o modificador de um atributo
 */
export const calculateAttributeMod = (value: number): number => {
  return Math.floor((value - 10) / 2);
};

/**
 * Calcula os Pontos de Vida
 */
export const calculatePV = (
  classe: ClassDescription,
  nivel: number,
  modCON: number
): number => {
  return classe.pv + classe.addpv * (nivel - 1) + modCON * nivel;
};

/**
 * Calcula os Pontos de Mana
 */
export const calculatePM = (
  classe: ClassDescription,
  nivel: number,
  modKeyAttr: number
): number => {
  return classe.pm + classe.addpm * (nivel - 1) + modKeyAttr * nivel;
};

/**
 * Calcula a Defesa
 */
export const calculateDefense = (
  modDEX: number,
  armorBonus: number = 0,
  shieldBonus: number = 0,
  otherBonuses: number = 0
): number => {
  return 10 + modDEX + armorBonus + shieldBonus + otherBonuses;
};

/**
 * Calcula o custo de um valor de atributo no sistema de compra de pontos
 */
export const calculatePointBuyCost = (value: number): number => {
  if (value < 8) return 0;
  if (value <= 13) return value - 8;
  if (value === 14) return 7;
  if (value === 15) return 9;
  return 0;
};

/**
 * Calcula o total de uma perícia
 */
export const calculateSkillTotal = (
  skill: Skill,
  sheet: CharacterSheet,
  isTrained: boolean
): number => {
  const halfLevel = Math.floor(sheet.nivel / 2);
  const skillAttr = SkillsAttrs[skill] as unknown as Atributo;
  const modAttr = sheet.atributos[skillAttr]?.mod || 0;
  const training = isTrained ? 2 : 0;

  // Penalidade de armadura para certas perícias
  const skillsWithPenalty = [
    Skill.ACROBACIA,
    Skill.FURTIVIDADE,
    Skill.LADINAGEM,
  ];
  const armorPenalty = skillsWithPenalty.includes(skill)
    ? sheet.extraArmorPenalty || 0
    : 0;

  return halfLevel + modAttr + training - armorPenalty;
};

/**
 * Gera a lista completa de perícias com valores calculados
 */
export const generateCompleteSkills = (
  sheet: CharacterSheet
): CompleteSkill[] => {
  return Object.values(Skill)
    .map((skill) => {
      const isTrained = sheet.skills.includes(skill);
      const skillAttr = SkillsAttrs[skill] as unknown as Atributo;

      return {
        name: skill,
        halfLevel: Math.floor(sheet.nivel / 2),
        modAttr: skillAttr,
        training: isTrained ? 2 : 0,
        others: 0,
      };
    })
    .filter(
      (skill) =>
        !skill.name.startsWith('Of') ||
        (skill.name.startsWith('Of') && skill.training > 0)
    );
};

/**
 * Calcula o atributo-chave para PM baseado na classe
 */
export const getKeyAttributeForClass = (
  classe: ClassDescription
): Atributo | null => {
  if (classe.spellPath) {
    return classe.spellPath.keyAttribute;
  }

  // Classes sem magia geralmente usam Inteligência para PM
  return Atributo.INTELIGENCIA;
};

/**
 * Calcula espaços disponíveis na mochila
 */
export const calculateMaxSpaces = (modFOR: number): number => {
  return 10 + modFOR;
};

/**
 * Calcula dinheiro inicial baseado no nível
 */
export const calculateInitialMoney = (nivel: number): number => {
  // Simulação de 2d6
  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  return (roll1 + roll2 + nivel) * 10;
};

/**
 * Recalcula toda a ficha após todas as escolhas
 */
export const recalculateSheet = (sheet: CharacterSheet): CharacterSheet => {
  const modCON = sheet.atributos.Constituição.mod;
  const modDEX = sheet.atributos.Destreza.mod;
  const modFOR = sheet.atributos.Força.mod;

  const keyAttr = getKeyAttributeForClass(sheet.classe);
  const modKeyAttr = keyAttr ? sheet.atributos[keyAttr].mod : 0;

  // Calcular PV e PM
  const pv = calculatePV(sheet.classe, sheet.nivel, modCON);
  const pm = calculatePM(sheet.classe, sheet.nivel, modKeyAttr);

  // Calcular defesa (sem armadura por enquanto)
  const defesa = calculateDefense(modDEX);

  // Calcular espaços máximos
  const maxSpaces = calculateMaxSpaces(modFOR);

  // Gerar perícias completas
  const completeSkills = generateCompleteSkills(sheet);

  return {
    ...sheet,
    pv,
    pm,
    defesa,
    maxSpaces,
    completeSkills,
  };
};

