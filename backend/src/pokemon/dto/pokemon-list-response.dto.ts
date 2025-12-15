/**
 * DTO para resposta da listagem de pokémons
 */
export class PokemonListItemDto {
  id!: number;
  name!: string;
  image!: string;
  types!: string[];
}

export class PokemonListResponseDto {
  /**
   * Total de pokémons disponíveis
   */
  count!: number;

  /**
   * URL para próxima página (se existir)
   */
  next!: string | null;

  /**
   * URL para página anterior (se existir)
   */
  previous!: string | null;

  /**
   * Lista de pokémons
   */
  results!: PokemonListItemDto[];
}
