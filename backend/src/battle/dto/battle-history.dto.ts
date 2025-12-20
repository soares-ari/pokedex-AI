import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para query de histórico de batalhas
 */
export class BattleHistoryQueryDto {
  /**
   * Número máximo de batalhas a retornar
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit deve ser um número inteiro' })
  @Min(1, { message: 'Limit deve ser no mínimo 1' })
  @Max(100, { message: 'Limit deve ser no máximo 100' })
  limit?: number = 10;
}

/**
 * DTO para item do histórico de batalhas
 */
export class BattleHistoryItemDto {
  id!: string;
  pokemon1Id!: string;
  pokemon1Name!: string;
  pokemon1Image!: string;
  pokemon2Id!: string;
  pokemon2Name!: string;
  pokemon2Image!: string;
  winnerId!: string;
  winnerName!: string;
  createdAt!: Date;
  battleLog!: {
    reasoning: string;
    battleNarrative: string;
  };
}

/**
 * DTO para resposta do histórico de batalhas
 */
export class BattleHistoryResponseDto {
  /**
   * Total de batalhas no histórico
   */
  total!: number;

  /**
   * Lista de batalhas
   */
  battles!: BattleHistoryItemDto[];
}
