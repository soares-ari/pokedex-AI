/**
 * DTO para resultado de uma batalha simulada
 */
export class BattleResultDto {
  /**
   * ID único da batalha salva no banco
   */
  battleId!: string;

  /**
   * Dados do primeiro pokémon
   */
  pokemon1!: {
    id: string;
    name: string;
  };

  /**
   * Dados do segundo pokémon
   */
  pokemon2!: {
    id: string;
    name: string;
  };

  /**
   * Dados do pokémon vencedor
   */
  winner!: {
    id: string;
    name: string;
  };

  /**
   * Narrativa da batalha gerada pela IA
   */
  battleNarrative!: string;

  /**
   * Raciocínio da IA sobre por que o pokémon venceu
   */
  reasoning!: string;

  /**
   * Data e hora da batalha
   */
  createdAt!: Date;
}
