import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Entidade que representa uma batalha entre dois pokémons
 * Armazena todos os detalhes da simulação e o resultado
 */
@Entity('battles')
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** ID ou nome do primeiro pokémon */
  @Column({ type: 'varchar' })
  pokemon1Id!: string;

  /** Nome do primeiro pokémon */
  @Column({ type: 'varchar' })
  pokemon1Name!: string;

  /** ID ou nome do segundo pokémon */
  @Column({ type: 'varchar' })
  pokemon2Id!: string;

  /** Nome do segundo pokémon */
  @Column({ type: 'varchar' })
  pokemon2Name!: string;

  /** ID do pokémon vencedor */
  @Column({ type: 'varchar' })
  winnerId!: string;

  /** Nome do pokémon vencedor */
  @Column({ type: 'varchar' })
  winnerName!: string;

  /**
   * Log detalhado da batalha em formato JSON
   * Contém narrativa, raciocínio da IA e outros detalhes
   */
  @Column({ type: 'jsonb' })
  battleLog!: {
    reasoning: string;
    battleNarrative: string;
    [key: string]: any;
  };

  /** Data e hora de criação da batalha */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
