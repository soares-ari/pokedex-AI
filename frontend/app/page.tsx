'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/lib/api';
import { PokemonCard } from '@/components/PokemonCard';

/**
 * Página principal - Listagem de Pokémons
 * Exibe grid de pokémons com paginação
 * Limite: 20 pokémons por página
 */
export default function HomePage() {
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Busca lista de pokémons com React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemons', page],
    queryFn: () => pokemonApi.getList(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar pokémons</p>
          <p className="text-sm">Verifique se o backend está rodando na porta 4000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Pokédex
        </h1>
        <p className="text-gray-700">
          {data?.count ? `${data.count} pokémons disponíveis` : 'Carregando...'}
        </p>
      </div>

      {/* Grid de pokémons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md h-64 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data && data.results && data.results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.results.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum pokémon encontrado</p>
        </div>
      )}

      {/* Paginação */}
      {data && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-medium"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 font-medium">
            Página {page + 1} de {Math.ceil(data.count / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={(page + 1) * ITEMS_PER_PAGE >= data.count}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-medium"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
