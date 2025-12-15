import { PokemonBattleData, BattleSimulationResult } from '../../ai/ai.service';

/**
 * Tabela de vantagens de tipos Pokémon
 * Mapeia tipo → tipos contra os quais tem vantagem
 */
const TYPE_ADVANTAGES: Record<string, string[]> = {
  fire: ['grass', 'ice', 'bug', 'steel'],
  water: ['fire', 'ground', 'rock'],
  grass: ['water', 'ground', 'rock'],
  electric: ['water', 'flying'],
  ice: ['grass', 'ground', 'flying', 'dragon'],
  fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
  poison: ['grass', 'fairy'],
  ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
  flying: ['grass', 'fighting', 'bug'],
  psychic: ['fighting', 'poison'],
  bug: ['grass', 'psychic', 'dark'],
  rock: ['fire', 'ice', 'flying', 'bug'],
  ghost: ['psychic', 'ghost'],
  dragon: ['dragon'],
  dark: ['psychic', 'ghost'],
  steel: ['ice', 'rock', 'fairy'],
  fairy: ['fighting', 'dragon', 'dark'],
};

/**
 * Helper class para lógica de batalha sem IA
 * Calcula vencedor baseado em estatísticas e vantagens de tipo
 */
export class BattleFallbackHelper {
  /**
   * Simula batalha usando lógica baseada em regras
   * @param pokemon1 Dados do primeiro pokémon
   * @param pokemon2 Dados do segundo pokémon
   * @returns Resultado da batalha com vencedor e narrativa
   */
  static simulateBattle(
    pokemon1: PokemonBattleData,
    pokemon2: PokemonBattleData,
  ): BattleSimulationResult {
    // Calcula scores base das estatísticas
    const pokemon1Score = this.calculateBaseScore(pokemon1);
    const pokemon2Score = this.calculateBaseScore(pokemon2);

    // Calcula multiplicadores de vantagem de tipo
    const pokemon1TypeMultiplier = this.calculateTypeAdvantage(
      pokemon1.types,
      pokemon2.types,
    );
    const pokemon2TypeMultiplier = this.calculateTypeAdvantage(
      pokemon2.types,
      pokemon1.types,
    );

    // Aplica multiplicadores
    const pokemon1FinalScore = pokemon1Score * pokemon1TypeMultiplier;
    const pokemon2FinalScore = pokemon2Score * pokemon2TypeMultiplier;

    // Determina vencedor
    const winner = pokemon1FinalScore > pokemon2FinalScore ? 'pokemon1' : 'pokemon2';
    const winnerPokemon = winner === 'pokemon1' ? pokemon1 : pokemon2;
    const loserPokemon = winner === 'pokemon1' ? pokemon2 : pokemon1;

    // Gera raciocínio
    const reasoning = this.generateReasoning(
      winnerPokemon,
      loserPokemon,
      winner === 'pokemon1' ? pokemon1TypeMultiplier : pokemon2TypeMultiplier,
    );

    // Gera narrativa
    const battleNarrative = this.generateNarrative(
      pokemon1,
      pokemon2,
      winnerPokemon,
    );

    return {
      winner,
      reasoning,
      battleNarrative,
    };
  }

  /**
   * Calcula score base somando estatísticas principais
   */
  private static calculateBaseScore(pokemon: PokemonBattleData): number {
    return (
      pokemon.stats.hp +
      pokemon.stats.attack +
      pokemon.stats.defense +
      pokemon.stats.specialAttack +
      pokemon.stats.specialDefense +
      pokemon.stats.speed
    );
  }

  /**
   * Calcula vantagem de tipo
   * @returns Multiplicador (1.0 = neutro, 1.5 = vantagem, 0.75 = desvantagem)
   */
  private static calculateTypeAdvantage(
    attackerTypes: string[],
    defenderTypes: string[],
  ): number {
    let multiplier = 1.0;

    for (const attackerType of attackerTypes) {
      for (const defenderType of defenderTypes) {
        const advantages = TYPE_ADVANTAGES[attackerType] || [];
        if (advantages.includes(defenderType)) {
          multiplier *= 1.5; // Vantagem
        }

        // Verifica se defensor tem vantagem sobre atacante (desvantagem)
        const defenderAdvantages = TYPE_ADVANTAGES[defenderType] || [];
        if (defenderAdvantages.includes(attackerType)) {
          multiplier *= 0.75; // Desvantagem
        }
      }
    }

    return multiplier;
  }

  /**
   * Gera raciocínio técnico sobre a vitória
   */
  private static generateReasoning(
    winner: PokemonBattleData,
    loser: PokemonBattleData,
    typeMultiplier: number,
  ): string {
    const parts: string[] = [];

    // Analisa vantagem de tipo
    if (typeMultiplier > 1.2) {
      parts.push(
        `${winner.name} possui vantagem de tipo significativa contra ${loser.name}`,
      );
    }

    // Analisa estatísticas
    if (winner.stats.attack > loser.stats.defense + 20) {
      parts.push(`com poder de ataque superior (${winner.stats.attack})`);
    }

    if (winner.stats.speed > loser.stats.speed) {
      parts.push(`e maior velocidade (${winner.stats.speed})`);
    }

    // Analisa HP
    if (winner.stats.hp > loser.stats.hp + 15) {
      parts.push(
        `combinado com maior resistência (${winner.stats.hp} HP)`,
      );
    }

    if (parts.length === 0) {
      return `${winner.name} venceu por ter estatísticas ligeiramente melhores em todos os aspectos da batalha.`;
    }

    return parts.join(', ') + '.';
  }

  /**
   * Gera narrativa épica da batalha
   */
  private static generateNarrative(
    pokemon1: PokemonBattleData,
    pokemon2: PokemonBattleData,
    winner: PokemonBattleData,
  ): string {
    const loser = winner.name === pokemon1.name ? pokemon2 : pokemon1;
    const fasterPokemon =
      pokemon1.stats.speed > pokemon2.stats.speed ? pokemon1 : pokemon2;

    return `A batalha começou com ${fasterPokemon.name} tomando a iniciativa graças à sua velocidade superior. ` +
      `${loser.name} tentou resistir com seus ataques do tipo ${loser.types.join(' e ')}, ` +
      `mas ${winner.name} demonstrou domínio superior com seus ataques devastadores. ` +
      `Após uma intensa troca de golpes, ${winner.name} emergiu vitorioso!`;
  }
}
