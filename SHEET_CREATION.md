# Sistema de Criação de Fichas - Tormenta 20

## Visão Geral

Este documento descreve o sistema completo de criação manual de personagens para Tormenta 20, incluindo todas as interfaces, cálculos e fluxos necessários.

## 1. Estrutura de Dados Principal

### CharacterSheet Interface

A interface central que representa uma ficha de personagem completa:

```typescript
interface CharacterSheet {
  id: string;
  nome: string;
  sexo: string;
  nivel: number;
  atributos: CharacterAttributes;
  raca: Race;
  classe: ClassDescription;
  origin?: { name: string; powers: GeneralPower[] };
  devoto?: string;
  skills: Skill[];
  generalPowers: GeneralPower[];
  classPowers: ClassPower[];
  spells: Spell[];
  bag: Bag;
  dinheiro: number;
  pv: number;
  pm: number;
  defesa: number;
  displacement: number;
  size: RaceSize;
  maxSpaces: number;
  extraArmorPenalty: number;
  completeSkills: CompleteSkill[];
  sheetBonuses: SheetBonus[];
  sheetActionHistory: SheetActionHistoryEntry[];
  sentidos: string[];
  steps: string[];
}
```

## 2. Atributos

### Sistema de Atributos

Os 6 atributos principais do T20:

- **Força (FOR)**: Poder físico, combate corpo a corpo
- **Destreza (DES)**: Agilidade, reflexos, combate à distância
- **Constituição (CON)**: Resistência, pontos de vida
- **Inteligência (INT)**: Raciocínio, conhecimento, pontos de mana
- **Sabedoria (SAB)**: Percepção, intuição, força de vontade
- **Carisma (CAR)**: Liderança, persuasão, presença

### Cálculo de Modificador

```typescript
mod = Math.floor((valor - 10) / 2)
```

Exemplos:
- Valor 10 = Mod +0
- Valor 14 = Mod +2
- Valor 18 = Mod +4
- Valor 8 = Mod -1

### Sistema de Compra de Pontos (Point Buy)

Total de pontos: **27**

Custos por valor:
- 8: 0 pontos
- 9: 1 ponto
- 10: 2 pontos
- 11: 3 pontos
- 12: 4 pontos
- 13: 5 pontos
- 14: 7 pontos
- 15: 9 pontos

## 3. Raças

### Estrutura da Raça

```typescript
interface Race {
  name: string;
  attributes: {
    attrs: Array<{ attr: string | 'any'; mod: number }>;
  };
  abilities: RaceAbility[];
  size: RaceSize;
  displacement: number;
  sentidos?: string[];
  setup?: (race: Race, allRaces: Race[]) => Race;
}
```

### Bônus Raciais

Aplicados APÓS a distribuição manual de pontos. Podem ser:
- **Fixos**: Ex: "Força +2"
- **Livres**: `attr: 'any'` permite escolha do jogador

## 4. Classes

### Estrutura da Classe

```typescript
interface ClassDescription {
  name: string;
  subname?: string;
  pv: number;          // PV inicial
  pm: number;          // PM inicial
  addpv: number;       // PV por nível adicional
  addpm: number;       // PM por nível adicional
  periciasbasicas: PericiasBasicas[];
  periciasrestantes: { qtd: number; list: Skill[] };
  proficiencias: string[];
  abilities: ClassAbility[];
  powers: ClassPower[];
  spellPath?: SpellPath;
  attrPriority: Atributo[];
  probDevoto: number;
  setup?: (classe: ClassDescription) => ClassDescription;
}
```

### Cálculo de PV e PM

**Pontos de Vida:**
```typescript
PV = classe.pv + (classe.addpv * (nivel - 1)) + (modCON * nivel)
```

**Pontos de Mana:**
```typescript
PM = classe.pm + (classe.addpm * (nivel - 1)) + (modAtributoChave * nivel)
```

O atributo-chave para PM depende da classe:
- Classes conjuradoras: usar `spellPath.keyAttribute`
- Outras classes: geralmente Inteligência

## 5. Perícias (Skills)

### Tipos de Perícias

Perícias são organizadas em duas categorias:

1. **Perícias Básicas**: Obrigatórias ou opções limitadas da classe
   - `type: 'and'` = todas são obrigatórias
   - `type: 'or'` = escolher uma ou mais das opções

2. **Perícias Restantes**: Quantidade livre de escolhas adicionais

### Cálculo do Total de Perícia

```typescript
Total = metadeNivel + modAtributo + treinamento + outros - penalidadeArmadura
```

Onde:
- **metadeNivel** = `Math.floor(nivel / 2)`
- **treinamento** = 2 se treinado, 0 se não
- **penalidadeArmadura** = aplica-se a Acrobacia, Furtividade e Ladinagem

## 6. Origem

### Estrutura da Origem

```typescript
interface Origin {
  name: string;
  pericias: Skill[];
  poderes: GeneralPower[];
  itens?: string[];
}
```

As origens concedem:
- Perícias adicionais automáticas
- Poderes de origem específicos
- Equipamentos iniciais (se aplicável)

## 7. Devoção

Personagens devotos a uma divindade podem escolher **poderes concedidos**. A quantidade depende do `probDevoto` da classe.

## 8. Poderes

### Tipos de Poderes

1. **Poderes Gerais**: Disponíveis para todas as classes
2. **Poderes de Classe**: Específicos de cada classe
3. **Poderes Concedidos**: Dados pela divindade (se devoto)

### Requisitos

Poderes podem ter requisitos:
- Nível mínimo
- Atributos mínimos
- Outros poderes como pré-requisito
- Proficiências específicas

### Quantidade de Poderes

```typescript
poderesGerais = 1 + poderesExtras
```

Poderes extras variam por nível e classe.

## 9. Magias

### Apenas para Classes Conjuradoras

Classes com `spellPath` definido podem aprender magias.

### Estrutura da Magia

```typescript
interface Spell {
  name: string;
  circulo: number;
  escola: SpellSchool;
  execucao: string;
  alcance: string;
  alvo: string;
  duracao: string;
  resistencia?: string;
  description: string;
}
```

### Círculos Disponíveis

Determinado pelo nível do personagem e pela progressão da classe:

- Nível 1-2: Círculo 1
- Nível 3-4: Círculo 2
- Nível 5-6: Círculo 3
- Nível 7-8: Círculo 4
- Nível 9+: Círculo 5

## 10. Equipamentos

### Dinheiro Inicial

```typescript
dinheiro = (2d6 + nivel) * 10 tibares
```

### Sistema de Espaços

```typescript
espacosMaximos = 10 + modFOR
```

Cada item ocupa uma quantidade de espaços baseada em seu peso e tamanho.

### Categorias de Equipamento

1. **Armas**: Simples, Marciais, Exóticas
2. **Armaduras**: Leves, Pesadas, Escudos
3. **Itens Gerais**: Aventura, ferramentas, consumíveis

## 11. Defesa

### Cálculo da Defesa

```typescript
Defesa = 10 + modDES + bonusArmadura + bonusEscudo + outrosBônus
```

## 12. Deslocamento

**Padrão**: 9 metros (6 quadrados de 1,5m)

Pode ser modificado por:
- Raça
- Tamanho
- Armadura pesada
- Poderes específicos

## 13. Tamanho (Size)

Afeta alcance, espaço ocupado e modificadores de combate:

- **Minúsculo**: -8 Defesa, +8 Ataque
- **Pequeno**: -2 Defesa, +2 Ataque
- **Médio**: Nenhum modificador
- **Grande**: +2 Defesa, -2 Ataque
- **Enorme**: +5 Defesa, -5 Ataque
- **Colossal**: +8 Defesa, -8 Ataque

## 14. Fluxo de Criação

### Ordem Recomendada

1. **Informações Básicas**: Nome, sexo, nível
2. **Raça**: Escolher raça (define tamanho, deslocamento, sentidos)
3. **Classe**: Escolher classe (define PV/PM base, perícias, proficiências)
4. **Atributos**: Distribuir 27 pontos (8-15), aplicar bônus raciais
5. **Perícias**: Selecionar perícias obrigatórias e opcionais
6. **Origem**: Escolher origem (perícias e equipamentos extras)
7. **Devoção**: Opcionalmente escolher divindade e poderes concedidos
8. **Poderes**: Selecionar poderes gerais e de classe
9. **Magias**: Se conjurador, selecionar magias conhecidas
10. **Equipamentos**: Comprar equipamentos com dinheiro inicial
11. **Revisão**: Revisar e recalcular todos os valores finais

### Cálculos Finais

No passo de revisão, recalcular:

```typescript
- PV e PM finais
- Defesa total
- Modificadores de atributos
- Totais de perícias
- Espaços ocupados vs disponíveis
- Aplicar todos os sheetBonuses
- Gerar completeSkills
```

## 15. SheetBonuses e SheetActions

### SheetBonus

Modificadores aplicados à ficha por poderes, magias ou equipamentos:

```typescript
interface SheetBonus {
  id: string;
  name: string;
  type: 'pv' | 'pm' | 'defesa' | 'atributo' | 'pericia' | etc;
  value: number;
  source: string;
}
```

### SheetAction

Ações que modificam a ficha de forma mais complexa:

```typescript
interface SheetAction {
  type: 'add_power' | 'add_skill' | 'modify_attribute' | etc;
  payload: any;
}
```

## 16. Validações Importantes

### Durante a Criação

- ✅ Nome não vazio
- ✅ Pontos de atributos = 27
- ✅ Quantidade correta de perícias selecionadas
- ✅ Requisitos de poderes atendidos
- ✅ Magias dentro do círculo disponível
- ✅ Equipamentos não excedem espaços disponíveis
- ✅ Dinheiro suficiente para compras

### Após a Criação

- Todos os valores calculados corretamente
- SheetBonuses aplicados
- CompleteSkills gerada
- Ficha válida e completa

## 17. Integração com o Sistema Existente

### Funções Reutilizáveis

- `src/functions/general.ts`: Cálculos gerais
- `src/functions/skills/`: Processamento de perícias
- `src/functions/powers.ts`: Validação de poderes
- `src/functions/spells/`: Processamento de magias

### Dados Existentes

- `src/data/racas.ts`: Lista de raças
- `src/data/classes.ts`: Lista de classes
- `src/data/origins.ts`: Origens
- `src/data/divindades.ts`: Divindades
- `src/data/poderes.ts`: Poderes gerais
- `src/data/spells/`: Magias por círculo

## 18. Interface do Wizard

### Componentes Material-UI

- **Stepper**: Navegação entre passos
- **Card**: Cards de seleção (raças, classes)
- **TextField**: Inputs de texto
- **Slider**: Controles numéricos
- **Checkbox**: Seleção múltipla (perícias, poderes)
- **Alert**: Mensagens informativas e validação

### Responsividade

- Desktop: Grid de 3 colunas para cards
- Tablet: Grid de 2 colunas
- Mobile: Grid de 1 coluna, Stepper vertical

## Conclusão

Este sistema permite criação completa e manual de personagens T20, com validações em tempo real e cálculos automáticos, proporcionando uma experiência guiada e sem erros para o usuário.
