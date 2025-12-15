import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { BattleModule } from './battle/battle.module';
import { AiModule } from './ai/ai.module';
import { DatabaseModule } from './database/database.module';

/**
 * Módulo raiz da aplicação
 * Importa todos os módulos principais e configura variáveis de ambiente
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente disponíveis globalmente
      envFilePath: '.env',
    }),
    DatabaseModule,
    PokemonModule,
    BattleModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
