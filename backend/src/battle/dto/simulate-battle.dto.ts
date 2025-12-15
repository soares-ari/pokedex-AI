import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para requisição de simulação de batalha
 */
export class SimulateBattleDto {
  /**
   * ID ou nome do primeiro pokémon
   */
  @IsNotEmpty({ message: 'pokemon1Id é obrigatório' })
  @IsString({ message: 'pokemon1Id deve ser uma string' })
  pokemon1Id!: string;

  /**
   * ID ou nome do segundo pokémon
   */
  @IsNotEmpty({ message: 'pokemon2Id é obrigatório' })
  @IsString({ message: 'pokemon2Id deve ser uma string' })
  pokemon2Id!: string;
}
