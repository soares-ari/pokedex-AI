import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

/**
 * Módulo de Pokémon
 * Responsável por consumir a PokeAPI e fornecer dados tratados
 */
@Module({
  imports: [HttpModule],
  providers: [PokemonService],
  controllers: [PokemonController],
  exports: [PokemonService], // Exporta para uso em outros módulos (ex: Battle)
})
export class PokemonModule {}
