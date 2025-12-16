'use client';

import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/lib/api';
import { TypeBadge } from '@/components/TypeBadge';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

/**
 * Página de detalhes do Pokémon
 * Exibe todas as características: nome, ID, altura, peso, tipos, habilidades e stats
 * Requisito: mínimo 6 características devem ser exibidas
 */
export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Busca detalhes do pokémon
  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonApi.getDetail(id),
  });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar pokémon</p>
          <p className="text-sm">Verifique se o backend está rodando</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Botão voltar */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        ← Voltar para Pokédex
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho com imagem */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Imagem oficial */}
            <div className="relative w-64 h-64 flex-shrink-0">
              <Image
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Informações principais */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm font-bold text-gray-500 mb-2">
                #{String(pokemon.id).padStart(3, '0')}
              </div>
              <h1 className="text-5xl font-bold text-gray-900 capitalize mb-4">
                {pokemon.name}
              </h1>
              <div className="flex gap-2 justify-center md:justify-start mb-4">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Altura</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pokemon.height / 10} m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pokemon.weight / 10} kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo com detalhes */}
        <div className="p-8">
          {/* Habilidades */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium capitalize"
                >
                  {ability.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Estatísticas Base
            </h2>
            <div className="space-y-4">
              {Object.entries({
                HP: pokemon.stats.hp,
                Attack: pokemon.stats.attack,
                Defense: pokemon.stats.defense,
                'Sp. Attack': pokemon.stats.specialAttack,
                'Sp. Defense': pokemon.stats.specialDefense,
                Speed: pokemon.stats.speed,
              }).map(([name, value]) => (
                <div key={name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((value / 255) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total de stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {pokemon.stats.hp +
                    pokemon.stats.attack +
                    pokemon.stats.defense +
                    pokemon.stats.specialAttack +
                    pokemon.stats.specialDefense +
                    pokemon.stats.speed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
