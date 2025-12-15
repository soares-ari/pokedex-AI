import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { Battle } from '../database/entities/battle.entity';
import { PokemonModule } from '../pokemon/pokemon.module';
import { AiModule } from '../ai/ai.module';

/**
 * Módulo de Batalha
 * Gerencia simulação de batalhas entre pokémons e histórico
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Battle]),
    PokemonModule, // Importa para usar PokemonService
    AiModule, // Importa para usar AiService
  ],
  providers: [BattleService],
  controllers: [BattleController],
})
export class BattleModule {}
