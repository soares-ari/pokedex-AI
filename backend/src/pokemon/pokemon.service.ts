import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  PokemonListResponseDto,
  PokemonListItemDto,
} from './dto/pokemon-list-response.dto';
import { PokemonDetailResponseDto } from './dto/pokemon-detail-response.dto';

/**
 * Service responsável por consumir a PokeAPI
 * Implementa cache em memória para evitar chamadas repetidas
 */
@Injectable()
export class PokemonService {
  private readonly pokeApiBaseUrl: string;
  private readonly cache = new Map<string, any>();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.pokeApiBaseUrl =
      this.configService.get<string>('POKEAPI_BASE_URL') ||
      'https://pokeapi.co/api/v2';
  }

  /**
   * Busca lista paginada de pokémons
   * @param limit Número de pokémons a retornar (1-100)
   * @param offset Número de pokémons a pular
   */
  async findAll(
    limit: number = 20,
    offset: number = 0,
  ): Promise<PokemonListResponseDto> {
    const cacheKey = `list_${limit}_${offset}`;

    // Verifica cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const url = `${this.pokeApiBaseUrl}/pokemon?limit=${limit}&offset=${offset}`;
      const response = await firstValueFrom(this.httpService.get(url));

      // Busca detalhes de cada pokémon para obter imagens e tipos
      const pokemonPromises = response.data.results.map(
        async (pokemon: any) => {
          const details = await this.getPokemonBasicInfo(pokemon.url);
          return details;
        },
      );

      const pokemonList = await Promise.all(pokemonPromises);

      const result: PokemonListResponseDto = {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: pokemonList,
      };

      // Armazena no cache
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      throw new NotFoundException(
        'Erro ao buscar pokémons da PokeAPI',
      );
    }
  }

  /**
   * Busca detalhes completos de um pokémon específico
   * @param id ID ou nome do pokémon
   */
  async findOne(id: string | number): Promise<PokemonDetailResponseDto> {
    const cacheKey = `detail_${id}`;

    // Verifica cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const url = `${this.pokeApiBaseUrl}/pokemon/${id}`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      const result: PokemonDetailResponseDto = {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: {
          hp: data.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
          attack:
            data.stats.find((s: any) => s.stat.name === 'attack')?.base_stat ||
            0,
          defense:
            data.stats.find((s: any) => s.stat.name === 'defense')?.base_stat ||
            0,
          specialAttack:
            data.stats.find((s: any) => s.stat.name === 'special-attack')
              ?.base_stat || 0,
          specialDefense:
            data.stats.find((s: any) => s.stat.name === 'special-defense')
              ?.base_stat || 0,
          speed:
            data.stats.find((s: any) => s.stat.name === 'speed')?.base_stat ||
            0,
        },
        sprites: data.sprites,
      };

      // Armazena no cache
      this.cache.set(cacheKey, result);

      return result;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Pokémon com ID/nome "${id}" não encontrado`);
      }
      throw new NotFoundException(
        'Erro ao buscar detalhes do pokémon',
      );
    }
  }

  /**
   * Método auxiliar para buscar informações básicas de um pokémon
   * Usado na listagem
   */
  private async getPokemonBasicInfo(url: string): Promise<PokemonListItemDto> {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
      };
    } catch (error) {
      throw new NotFoundException('Erro ao buscar informações do pokémon');
    }
  }
}
