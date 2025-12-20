import axios from 'axios';

/**
 * Cliente HTTP configurado para comunicação com a API backend
 * URL base é configurada através de variável de ambiente
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Tipos de Pokémon =====
export interface PokemonListItem {
  id: number;
  name: string;
  types: string[];
  image: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

// ===== Tipos de Batalha =====
export interface BattleRequest {
  pokemon1Id: string;
  pokemon2Id: string;
}

export interface BattleResult {
  battleId: string;
  pokemon1: {
    id: string;
    name: string;
  };
  pokemon2: {
    id: string;
    name: string;
  };
  winner: {
    id: string;
    name: string;
  };
  battleNarrative: string;
  reasoning: string;
  createdAt: string;
}

export interface BattleHistoryItem {
  id: string;
  pokemon1Name: string;
  pokemon2Name: string;
  winnerName: string;
  createdAt: string;
  battleLog: {
    reasoning: string;
    battleNarrative: string;
  };
}

export interface BattleHistoryResponse {
  total: number;
  battles: BattleHistoryItem[];
}

// ===== Funções da API =====

/**
 * Funções para interação com endpoints de Pokémon
 */
export const pokemonApi = {
  getList: async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
    const response = await api.get('/pokemon', { params: { limit, offset } });
    return response.data;
  },

  getDetail: async (id: string): Promise<PokemonDetail> => {
    const response = await api.get(`/pokemon/${id}`);
    return response.data;
  },
};

/**
 * Funções para interação com endpoints de Batalha
 */
export const battleApi = {
  simulate: async (data: BattleRequest): Promise<BattleResult> => {
    const response = await api.post('/battle/simulate', data);
    return response.data;
  },

  getHistory: async (limit = 10): Promise<BattleHistoryResponse> => {
    const response = await api.get('/battle/history', { params: { limit } });
    return response.data;
  },
};
