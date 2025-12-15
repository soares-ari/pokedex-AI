/**
 * DTO para resposta de detalhes de um pokémon
 */
export class PokemonStatDto {
  name!: string;
  value!: number;
}

export class PokemonSpriteDto {
  front_default!: string;
  front_shiny!: string;
  other!: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export class PokemonDetailResponseDto {
  /**
   * ID do pokémon
   */
  id!: number;

  /**
   * Nome do pokémon
   */
  name!: string;

  /**
   * Altura do pokémon (em decímetros)
   */
  height!: number;

  /**
   * Peso do pokémon (em hectogramas)
   */
  weight!: number;

  /**
   * Tipos do pokémon (ex: fire, water)
   */
  types!: string[];

  /**
   * Habilidades do pokémon
   */
  abilities!: string[];

  /**
   * Estatísticas do pokémon (HP, Attack, Defense, Speed, etc)
   */
  stats!: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };

  /**
   * Sprites (imagens) do pokémon
   */
  sprites!: PokemonSpriteDto;
}
