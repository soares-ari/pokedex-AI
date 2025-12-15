import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Battle } from './entities/battle.entity';

/**
 * Módulo de configuração do banco de dados PostgreSQL
 * Usa TypeORM para gerenciar conexão e entidades
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Battle],
        synchronize: false, // Usar migrations em produção
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Battle]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
