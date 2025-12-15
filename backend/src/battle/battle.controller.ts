import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { BattleService } from './battle.service';
import { SimulateBattleDto } from './dto/simulate-battle.dto';
import { BattleResultDto } from './dto/battle-result.dto';
import {
  BattleHistoryQueryDto,
  BattleHistoryResponseDto,
} from './dto/battle-history.dto';

/**
 * Controller de Batalhas
 * Endpoints para simular batalhas e consultar histórico
 */
@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  /**
   * POST /api/battle/simulate
   * Simula uma batalha entre dois pokémons
   */
  @Post('simulate')
  async simulateBattle(
    @Body() simulateBattleDto: SimulateBattleDto,
  ): Promise<BattleResultDto> {
    return this.battleService.simulateBattle(
      simulateBattleDto.pokemon1Id,
      simulateBattleDto.pokemon2Id,
    );
  }

  /**
   * GET /api/battle/history?limit=10
   * Retorna histórico de batalhas
   */
  @Get('history')
  async getBattleHistory(
    @Query() query: BattleHistoryQueryDto,
  ): Promise<BattleHistoryResponseDto> {
    return this.battleService.getBattleHistory(query.limit);
  }
}
