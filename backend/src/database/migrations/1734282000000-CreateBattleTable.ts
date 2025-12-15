import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration para criar a tabela de batalhas
 */
export class CreateBattleTable1734282000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'battles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'pokemon1Id',
            type: 'varchar',
          },
          {
            name: 'pokemon1Name',
            type: 'varchar',
          },
          {
            name: 'pokemon2Id',
            type: 'varchar',
          },
          {
            name: 'pokemon2Name',
            type: 'varchar',
          },
          {
            name: 'winnerId',
            type: 'varchar',
          },
          {
            name: 'winnerName',
            type: 'varchar',
          },
          {
            name: 'battleLog',
            type: 'jsonb',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Habilita a extensão uuid-ossp para gerar UUIDs
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('battles');
  }
}
