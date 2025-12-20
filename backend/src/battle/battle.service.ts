import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from '../database/entities/battle.entity';
import { PokemonService } from '../pokemon/pokemon.service';
import { AiService, PokemonBattleData } from '../ai/ai.service';
import { BattleFallbackHelper } from './helpers/battle-fallback.helper';
import { BattleResultDto } from './dto/battle-result.dto';
import {
  BattleHistoryResponseDto,
  BattleHistoryItemDto,
} from './dto/battle-history.dto';

/**
 * Service responsável pela lógica de batalhas
 * Coordena PokemonService, AiService e persistência no banco
 */
@Injectable()
export class BattleService {
  private readonly logger = new Logger(BattleService.name);

  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository: Repository<Battle>,
    private readonly pokemonService: PokemonService,
    private readonly aiService: AiService,
  ) {}

  /**
   * Simula uma batalha entre dois pokémons
   * @param pokemon1Id ID ou nome do primeiro pokémon
   * @param pokemon2Id ID ou nome do segundo pokémon
   * @returns Resultado completo da batalha
   */
  async simulateBattle(
    pokemon1Id: string,
    pokemon2Id: string,
  ): Promise<BattleResultDto> {
    // Validação: não pode batalhar o mesmo pokémon
    if (pokemon1Id.toLowerCase() === pokemon2Id.toLowerCase()) {
      throw new BadRequestException(
        'Não é possível simular uma batalha entre o mesmo pokémon',
      );
    }

    this.logger.log(`Starting battle: ${pokemon1Id} vs ${pokemon2Id}`);

    // Busca dados dos pokémons
    const [pokemon1Details, pokemon2Details] = await Promise.all([
      this.pokemonService.findOne(pokemon1Id),
      this.pokemonService.findOne(pokemon2Id),
    ]);

    // Prepara dados para a IA
    const pokemon1Data: PokemonBattleData = {
      id: pokemon1Details.id,
      name: pokemon1Details.name,
      types: pokemon1Details.types,
      stats: pokemon1Details.stats,
    };

    const pokemon2Data: PokemonBattleData = {
      id: pokemon2Details.id,
      name: pokemon2Details.name,
      types: pokemon2Details.types,
      stats: pokemon2Details.stats,
    };

    // Tenta simular com IA, usa fallback se falhar
    let battleResult;
    try {
      battleResult = await this.aiService.simulateBattle(
        pokemon1Data,
        pokemon2Data,
      );
      this.logger.log('Battle simulated using AI');
    } catch (error: any) {
      this.logger.warn(`AI simulation failed: ${error.message}. Using fallback logic.`);
      battleResult = BattleFallbackHelper.simulateBattle(
        pokemon1Data,
        pokemon2Data,
      );
      this.logger.log('Battle simulated using fallback logic');
    }

    // Determina vencedor
    const winner =
      battleResult.winner === 'pokemon1' ? pokemon1Details : pokemon2Details;

    // Salva batalha no banco de dados
    const battle = this.battleRepository.create({
      pokemon1Id: pokemon1Details.id.toString(),
      pokemon1Name: pokemon1Details.name,
      pokemon2Id: pokemon2Details.id.toString(),
      pokemon2Name: pokemon2Details.name,
      winnerId: winner.id.toString(),
      winnerName: winner.name,
      battleLog: {
        reasoning: battleResult.reasoning,
        battleNarrative: battleResult.battleNarrative,
        pokemon1Stats: pokemon1Details.stats,
        pokemon2Stats: pokemon2Details.stats,
      },
    });

    const savedBattle = await this.battleRepository.save(battle);

    this.logger.log(`Battle saved with ID: ${savedBattle.id}`);

    // Retorna resultado formatado
    return {
      battleId: savedBattle.id,
      pokemon1: {
        id: pokemon1Details.id.toString(),
        name: pokemon1Details.name,
      },
      pokemon2: {
        id: pokemon2Details.id.toString(),
        name: pokemon2Details.name,
      },
      winner: {
        id: winner.id.toString(),
        name: winner.name,
      },
      battleNarrative: battleResult.battleNarrative,
      reasoning: battleResult.reasoning,
      createdAt: savedBattle.createdAt,
    };
  }

  /**
   * Busca histórico de batalhas
   * @param limit Número máximo de batalhas a retornar
   * @returns Lista das batalhas mais recentes
   */
  async getBattleHistory(limit: number = 10): Promise<BattleHistoryResponseDto> {
    const [battles, total] = await this.battleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const battleItems: BattleHistoryItemDto[] = battles.map((battle) => ({
      id: battle.id,
      pokemon1Name: battle.pokemon1Name,
      pokemon2Name: battle.pokemon2Name,
      winnerName: battle.winnerName,
      createdAt: battle.createdAt,
      battleLog: battle.battleLog,
    }));

    return {
      total,
      battles: battleItems,
    };
  }
}
