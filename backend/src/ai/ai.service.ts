import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * Interface para dados de um pokémon na batalha
 */
export interface PokemonBattleData {
  id: number;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

/**
 * Interface para resultado da simulação de batalha
 */
export interface BattleSimulationResult {
  winner: 'pokemon1' | 'pokemon2';
  reasoning: string;
  battleNarrative: string;
}

/**
 * Service responsável pela integração com OpenAI GPT-4
 * Simula batalhas entre pokémons usando inteligência artificial
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI client initialized successfully');
    } else {
      this.openai = null;
      this.logger.warn('OpenAI API key not found. Battles will use fallback logic.');
    }
  }

  /**
   * Simula uma batalha entre dois pokémons usando OpenAI GPT-4
   * @param pokemon1 Dados do primeiro pokémon
   * @param pokemon2 Dados do segundo pokémon
   * @returns Resultado da simulação com vencedor, raciocínio e narrativa
   */
  async simulateBattle(
    pokemon1: PokemonBattleData,
    pokemon2: PokemonBattleData,
  ): Promise<BattleSimulationResult> {
    // Se OpenAI não estiver disponível, retorna null para usar fallback
    if (!this.openai) {
      this.logger.warn('OpenAI not available, returning null for fallback');
      throw new Error('OpenAI not configured');
    }

    try {
      const prompt = this.buildBattlePrompt(pokemon1, pokemon2);

      this.logger.log(`Simulating battle: ${pokemon1.name} vs ${pokemon2.name}`);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um juiz especialista em batalhas Pokémon. Analise cuidadosamente os pokémons e determine o vencedor baseado em tipos, estatísticas e vantagens elementais. SEMPRE retorne suas respostas em formato JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const result = JSON.parse(content) as BattleSimulationResult;

      // Valida o resultado
      if (!result.winner || !result.reasoning || !result.battleNarrative) {
        throw new Error('Invalid response format from OpenAI');
      }

      this.logger.log(`Battle completed. Winner: ${result.winner}`);

      return result;
    } catch (error: any) {
      this.logger.error(`Error in AI battle simulation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Constrói o prompt para a OpenAI com os dados dos pokémons
   */
  private buildBattlePrompt(
    pokemon1: PokemonBattleData,
    pokemon2: PokemonBattleData,
  ): string {
    return `
Analise a seguinte batalha Pokémon e determine o vencedor:

**Pokémon 1: ${pokemon1.name}**
- Tipos: ${pokemon1.types.join(', ')}
- HP: ${pokemon1.stats.hp}
- Attack: ${pokemon1.stats.attack}
- Defense: ${pokemon1.stats.defense}
- Special Attack: ${pokemon1.stats.specialAttack}
- Special Defense: ${pokemon1.stats.specialDefense}
- Speed: ${pokemon1.stats.speed}

**Pokémon 2: ${pokemon2.name}**
- Tipos: ${pokemon2.types.join(', ')}
- HP: ${pokemon2.stats.hp}
- Attack: ${pokemon2.stats.attack}
- Defense: ${pokemon2.stats.defense}
- Special Attack: ${pokemon2.stats.specialAttack}
- Special Defense: ${pokemon2.stats.specialDefense}
- Speed: ${pokemon2.stats.speed}

Considere:
1. Vantagens e desvantagens de tipos elementais
2. Estatísticas base de cada pokémon
3. Velocidade (quem ataca primeiro)
4. Resistências e fraquezas

Retorne um JSON com a seguinte estrutura:
{
  "winner": "pokemon1" ou "pokemon2",
  "reasoning": "Explicação técnica de 2-3 frases sobre por que esse pokémon venceu",
  "battleNarrative": "Narrativa épica da batalha em 3-4 frases, descrevendo os momentos chave do combate"
}
    `.trim();
  }
}
