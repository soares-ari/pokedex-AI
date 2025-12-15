import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Battle } from './entities/battle.entity';

// Carrega variáveis de ambiente
config();

/**
 * DataSource do TypeORM para migrations
 * Este arquivo é usado pelo CLI do TypeORM para gerar e executar migrations
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Battle],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
