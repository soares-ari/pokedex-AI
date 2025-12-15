import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para validar query parameters da listagem de pokémons
 */
export class GetPokemonsQueryDto {
  /**
   * Número de pokémons a retornar
   * Mínimo: 1, Máximo: 100
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit deve ser um número inteiro' })
  @Min(1, { message: 'Limit deve ser no mínimo 1' })
  @Max(100, { message: 'Limit deve ser no máximo 100' })
  limit?: number = 20;

  /**
   * Número de pokémons a pular (para paginação)
   * Mínimo: 0
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Offset deve ser um número inteiro' })
  @Min(0, { message: 'Offset deve ser no mínimo 0' })
  offset?: number = 0;
}
