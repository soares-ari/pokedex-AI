import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { PokemonService } from './pokemon.service';

/**
 * Testes unitários do PokemonService
 * Testa integração com PokeAPI, cache e tratamento de erros
 */
describe('PokemonService', () => {
  let service: PokemonService;

  // Mock do HttpService para simular chamadas HTTP
  const mockHttpService = {
    get: jest.fn(),
  };

  // Mock do ConfigService para simular variáveis de ambiente
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'POKEAPI_BASE_URL') {
        return 'https://pokeapi.co/api/v2';
      }
      return null;
    }),
  };

  /**
   * Configuração antes de cada teste
   * Cria uma instância limpa do módulo com mocks
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  /**
   * Limpa mocks após cada teste para evitar interferência
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de pokémons', async () => {
      // Mock da resposta da PokeAPI para listagem
      const mockListResponse = {
        data: {
          count: 1302,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          ],
        },
      };

      // Mock da resposta de detalhes do pokémon
      const mockPokemonDetail = {
        data: {
          id: 1,
          name: 'bulbasaur',
          sprites: {
            other: {
              'official-artwork': {
                front_default: 'https://example.com/bulbasaur.png',
              },
            },
          },
          types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        },
      };

      // Configura o mock para retornar as respostas
      mockHttpService.get
        .mockReturnValueOnce(of(mockListResponse))
        .mockReturnValueOnce(of(mockPokemonDetail));

      const result = await service.findAll(20, 0);

      // Validações
      expect(result).toBeDefined();
      expect(result.count).toBe(1302);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('bulbasaur');
      expect(result.results[0].types).toContain('grass');
    });

    it('deve usar valores padrão se limit e offset não forem fornecidos', async () => {
      const mockListResponse = {
        data: {
          count: 1302,
          next: null,
          previous: null,
          results: [],
        },
      };

      mockHttpService.get.mockReturnValueOnce(of(mockListResponse));

      await service.findAll();

      // Verifica se chamou com valores padrão (limit=20, offset=0)
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
      );
    });

    it('deve lançar NotFoundException em caso de erro na API', async () => {
      // Simula erro de rede
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => new Error('Network error')),
      );

      await expect(service.findAll(20, 0)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('deve retornar detalhes de um pokémon por ID numérico', async () => {
      // Mock completo de detalhes do Pikachu
      const mockPokemonDetail = {
        data: {
          id: 25,
          name: 'pikachu',
          height: 4,
          weight: 60,
          types: [{ type: { name: 'electric' } }],
          abilities: [{ ability: { name: 'static' } }],
          stats: [
            { stat: { name: 'hp' }, base_stat: 35 },
            { stat: { name: 'attack' }, base_stat: 55 },
            { stat: { name: 'defense' }, base_stat: 40 },
            { stat: { name: 'special-attack' }, base_stat: 50 },
            { stat: { name: 'special-defense' }, base_stat: 50 },
            { stat: { name: 'speed' }, base_stat: 90 },
          ],
          sprites: {
            front_default: 'https://example.com/pikachu.png',
            front_shiny: 'https://example.com/pikachu-shiny.png',
            other: {
              'official-artwork': {
                front_default: 'https://example.com/pikachu-artwork.png',
              },
            },
          },
        },
      };

      mockHttpService.get.mockReturnValueOnce(of(mockPokemonDetail));

      const result = await service.findOne(25);

      // Validações dos dados retornados
      expect(result).toBeDefined();
      expect(result.id).toBe(25);
      expect(result.name).toBe('pikachu');
      expect(result.types).toContain('electric');
      expect(result.stats.hp).toBe(35);
      expect(result.stats.speed).toBe(90);
    });

    it('deve retornar detalhes de um pokémon por nome', async () => {
      // Mock de Charizard com múltiplos tipos
      const mockPokemonDetail = {
        data: {
          id: 6,
          name: 'charizard',
          height: 17,
          weight: 905,
          types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
          abilities: [{ ability: { name: 'blaze' } }],
          stats: [
            { stat: { name: 'hp' }, base_stat: 78 },
            { stat: { name: 'attack' }, base_stat: 84 },
            { stat: { name: 'defense' }, base_stat: 78 },
            { stat: { name: 'special-attack' }, base_stat: 109 },
            { stat: { name: 'special-defense' }, base_stat: 85 },
            { stat: { name: 'speed' }, base_stat: 100 },
          ],
          sprites: {
            front_default: 'https://example.com/charizard.png',
            front_shiny: 'https://example.com/charizard-shiny.png',
            other: {
              'official-artwork': {
                front_default: 'https://example.com/charizard-artwork.png',
              },
            },
          },
        },
      };

      mockHttpService.get.mockReturnValueOnce(of(mockPokemonDetail));

      const result = await service.findOne('charizard');

      expect(result).toBeDefined();
      expect(result.name).toBe('charizard');
      expect(result.types).toEqual(['fire', 'flying']);
    });

    it('deve lançar NotFoundException se pokémon não existir', async () => {
      // Simula resposta 404 da API
      mockHttpService.get.mockReturnValue(
        throwError(() => ({
          response: { status: 404 },
        })),
      );

      await expect(service.findOne('invalid-pokemon')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('invalid-pokemon')).rejects.toThrow(
        'Pokémon com ID/nome "invalid-pokemon" não encontrado',
      );
    });
  });

  describe('Cache', () => {
    it('deve armazenar em cache e reutilizar na segunda chamada do findAll', async () => {
      const mockListResponse = {
        data: {
          count: 1302,
          next: null,
          previous: null,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          ],
        },
      };

      const mockPokemonDetail = {
        data: {
          id: 1,
          name: 'bulbasaur',
          sprites: {
            other: {
              'official-artwork': {
                front_default: 'https://example.com/bulbasaur.png',
              },
            },
          },
          types: [{ type: { name: 'grass' } }],
        },
      };

      mockHttpService.get
        .mockReturnValueOnce(of(mockListResponse))
        .mockReturnValueOnce(of(mockPokemonDetail));

      // Primeira chamada - deve fazer requisição HTTP
      await service.findAll(20, 0);
      expect(mockHttpService.get).toHaveBeenCalledTimes(2);

      // Segunda chamada com mesmos parâmetros - deve usar cache
      await service.findAll(20, 0);
      expect(mockHttpService.get).toHaveBeenCalledTimes(2); // Não aumentou
    });

    it('deve armazenar em cache e reutilizar na segunda chamada do findOne', async () => {
      const mockPokemonDetail = {
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          types: [{ type: { name: 'grass' } }],
          abilities: [{ ability: { name: 'overgrow' } }],
          stats: [
            { stat: { name: 'hp' }, base_stat: 45 },
            { stat: { name: 'attack' }, base_stat: 49 },
            { stat: { name: 'defense' }, base_stat: 49 },
            { stat: { name: 'special-attack' }, base_stat: 65 },
            { stat: { name: 'special-defense' }, base_stat: 65 },
            { stat: { name: 'speed' }, base_stat: 45 },
          ],
          sprites: {},
        },
      };

      mockHttpService.get.mockReturnValueOnce(of(mockPokemonDetail));

      // Primeira chamada - deve fazer requisição HTTP
      await service.findOne(1);
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);

      // Segunda chamada com mesmo ID - deve usar cache
      await service.findOne(1);
      expect(mockHttpService.get).toHaveBeenCalledTimes(1); // Não aumentou
    });
  });
});
