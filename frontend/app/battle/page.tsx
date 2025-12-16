'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pokemonApi, battleApi, type BattleResult } from '@/lib/api';

/**
 * Página Battle Arena
 * Permite selecionar dois pokémons e simular uma batalha com IA
 * Exibe histórico de batalhas anteriores
 */
export default function BattlePage() {
  const [pokemon1Id, setPokemon1Id] = useState('');
  const [pokemon2Id, setPokemon2Id] = useState('');
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const queryClient = useQueryClient();

  // Busca lista de pokémons para seletores
  const { data: pokemonList } = useQuery({
    queryKey: ['pokemons-for-battle'],
    queryFn: () => pokemonApi.getList(151, 0), // Primeiros 151 pokémons
  });

  // Busca histórico de batalhas
  const { data: history } = useQuery({
    queryKey: ['battle-history'],
    queryFn: () => battleApi.getHistory(10),
  });

  // Mutation para simular batalha
  const battleMutation = useMutation({
    mutationFn: battleApi.simulate,
    onSuccess: (data) => {
      setBattleResult(data);
      // Atualiza o histórico
      queryClient.invalidateQueries({ queryKey: ['battle-history'] });
    },
  });

  const handleBattle = () => {
    if (!pokemon1Id || !pokemon2Id) {
      alert('Selecione dois pokémons para batalhar!');
      return;
    }

    if (pokemon1Id === pokemon2Id) {
      alert('Selecione pokémons diferentes!');
      return;
    }

    setBattleResult(null);
    battleMutation.mutate({ pokemon1Id, pokemon2Id });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Battle Arena</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seleção e Simulação de Batalha */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Selecione os Pokémons
          </h2>

          {/* Seletores */}
          <div className="space-y-6 mb-6">
            {/* Pokémon 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pokémon 1
              </label>
              <select
                value={pokemon1Id}
                onChange={(e) => setPokemon1Id(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
              >
                <option value="">Selecione um pokémon</option>
                {pokemonList?.results.map((pokemon) => (
                  <option key={pokemon.id} value={pokemon.id}>
                    #{String(pokemon.id).padStart(3, '0')} - {pokemon.name}
                  </option>
                ))}
              </select>
            </div>

            {/* VS Badge */}
            <div className="flex justify-center">
              <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-lg">
                VS
              </span>
            </div>

            {/* Pokémon 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pokémon 2
              </label>
              <select
                value={pokemon2Id}
                onChange={(e) => setPokemon2Id(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
              >
                <option value="">Selecione um pokémon</option>
                {pokemonList?.results.map((pokemon) => (
                  <option key={pokemon.id} value={pokemon.id}>
                    #{String(pokemon.id).padStart(3, '0')} - {pokemon.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão de Batalha */}
          <button
            onClick={handleBattle}
            disabled={battleMutation.isPending}
            className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {battleMutation.isPending ? 'Simulando Batalha...' : '⚔️ Iniciar Batalha!'}
          </button>

          {/* Erro */}
          {battleMutation.isError && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Erro ao simular batalha</p>
              <p className="text-sm">Verifique se o backend está rodando</p>
            </div>
          )}

          {/* Resultado da Batalha */}
          {battleResult && (
            <div className="mt-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                🏆 Vencedor: {battleResult.winner.name.toUpperCase()}!
              </h3>

              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Raciocínio:
                </p>
                <p className="text-gray-900">{battleResult.reasoning}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Narrativa da Batalha:
                </p>
                <p className="text-gray-900">{battleResult.battleNarrative}</p>
              </div>
            </div>
          )}
        </div>

        {/* Histórico de Batalhas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Histórico de Batalhas
          </h2>

          {history && history.battles.length > 0 ? (
            <div className="space-y-4">
              {history.battles.map((battle) => (
                <div
                  key={battle.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize text-gray-700">
                      {battle.pokemon1Name}
                    </span>
                    <span className="text-sm text-gray-500">VS</span>
                    <span className="font-medium capitalize text-gray-700">
                      {battle.pokemon2Name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(battle.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold capitalize">
                      🏆 {battle.winnerName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhuma batalha realizada ainda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
