import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { GetPokemonsQueryDto } from './dto/get-pokemons-query.dto';
import {
  PokemonListResponseDto,
} from './dto/pokemon-list-response.dto';
import { PokemonDetailResponseDto } from './dto/pokemon-detail-response.dto';

/**
 * Controller de Pokémon
 * Endpoints para listar e buscar detalhes de pokémons
 */
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * GET /api/pokemon?limit=20&offset=0
   * Lista pokémons com paginação
   */
  @Get()
  async findAll(
    @Query() query: GetPokemonsQueryDto,
  ): Promise<PokemonListResponseDto> {
    return this.pokemonService.findAll(query.limit, query.offset);
  }

  /**
   * GET /api/pokemon/:id
   * Busca detalhes de um pokémon específico
   * @param id ID ou nome do pokémon
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PokemonDetailResponseDto> {
    return this.pokemonService.findOne(id);
  }
}
