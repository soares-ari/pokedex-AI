'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pokemonApi, battleApi, type BattleResult } from '@/lib/api';
import { PokemonSearchInput } from '@/components/PokemonSearchInput';

/**
 * Página Battle Arena
 * Permite selecionar dois pokémons e simular uma batalha com IA
 * Exibe histórico de batalhas anteriores
 * Suporta pré-seleção via query params: ?pokemon1=25&pokemon2=1
 */
export default function BattlePage() {
  const searchParams = useSearchParams();
  const [pokemon1Id, setPokemon1Id] = useState('');
  const [pokemon2Id, setPokemon2Id] = useState('');
  const [pokemon1Name, setPokemon1Name] = useState('');
  const [pokemon2Name, setPokemon2Name] = useState('');
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [expandedBattleId, setExpandedBattleId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Busca pokémons iniciais para seletores (usuário pode buscar pelo nome para encontrar qualquer um dos 1350)
  const { data: pokemonList, isLoading: isLoadingPokemon } = useQuery({
    queryKey: ['pokemons-for-battle'],
    queryFn: () => pokemonApi.getList(151, 0), // Primeira geração + busca pelo nome permite acessar todos
  });

  // Busca histórico de batalhas
  const { data: history } = useQuery({
    queryKey: ['battle-history'],
    queryFn: () => battleApi.getHistory(10),
  });

  // Pré-seleciona pokémons baseado em query params
  useEffect(() => {
    const pokemon1Param = searchParams.get('pokemon1');
    const pokemon2Param = searchParams.get('pokemon2');

    if (pokemon1Param && pokemonList?.results) {
      const pokemon = pokemonList.results.find(p => p.id.toString() === pokemon1Param || p.name === pokemon1Param);
      if (pokemon) {
        setPokemon1Id(pokemon.id.toString());
        setPokemon1Name(pokemon.name);
      } else {
        // Se não encontrar na lista, usa o valor direto (entrada manual)
        setPokemon1Id(pokemon1Param);
        setPokemon1Name(pokemon1Param);
      }
    }

    if (pokemon2Param && pokemonList?.results) {
      const pokemon = pokemonList.results.find(p => p.id.toString() === pokemon2Param || p.name === pokemon2Param);
      if (pokemon) {
        setPokemon2Id(pokemon.id.toString());
        setPokemon2Name(pokemon.name);
      } else {
        setPokemon2Id(pokemon2Param);
        setPokemon2Name(pokemon2Param);
      }
    }
  }, [searchParams, pokemonList]);

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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Battle Arena</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seleção e Simulação de Batalha */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Selecione os Pokémons
          </h2>

          {/* Seletores */}
          {isLoadingPokemon ? (
            <div className="space-y-6 mb-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-center">
                <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-lg">
                  VS
                </span>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : pokemonList && pokemonList.results && pokemonList.results.length > 0 ? (
            <div className="space-y-6 mb-6">
              {/* Pokémon 1 */}
              <PokemonSearchInput
                pokemonList={pokemonList.results}
                value={pokemon1Name}
                onChange={(id, name) => {
                  setPokemon1Id(id);
                  setPokemon1Name(name);
                }}
                placeholder="Digite ou selecione um pokémon"
                label="Pokémon 1"
              />

              {/* VS Badge */}
              <div className="flex justify-center">
                <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-lg">
                  VS
                </span>
              </div>

              {/* Pokémon 2 */}
              <PokemonSearchInput
                pokemonList={pokemonList.results}
                value={pokemon2Name}
                onChange={(id, name) => {
                  setPokemon2Id(id);
                  setPokemon2Name(name);
                }}
                placeholder="Digite ou selecione um pokémon"
                label="Pokémon 2"
              />
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Erro ao carregar lista de pokémons. Verifique se o backend está rodando.
              </p>
            </div>
          )}

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
              {history.battles.map((battle) => {
                const isExpanded = expandedBattleId === battle.id;

                return (
                  <div
                    key={battle.id}
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all"
                  >
                    {/* Header - Clickable */}
                    <div
                      onClick={() => setExpandedBattleId(isExpanded ? null : battle.id)}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        {/* Pokemon 1 com avatar */}
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200 shrink-0">
                            <img
                              src={battle.pokemon1Image}
                              alt={battle.pokemon1Name}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                            />
                          </div>
                          <span className="font-semibold capitalize text-gray-800 truncate">
                            {battle.pokemon1Name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-100 to-blue-100 rounded-full shrink-0">
                          <span className="text-xs font-bold text-red-600">VS</span>
                        </div>

                        {/* Pokemon 2 com avatar */}
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="font-semibold capitalize text-gray-800 truncate">
                            {battle.pokemon2Name}
                          </span>
                          <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-red-200 shrink-0">
                            <img
                              src={battle.pokemon2Image}
                              alt={battle.pokemon2Name}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                            />
                          </div>
                        </div>
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
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold capitalize">
                            🏆 {battle.winnerName}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && battle.battleLog && (
                      <div className="border-t border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-white">
                        {/* Reasoning Section */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>💡</span>
                            <span>Raciocínio da IA:</span>
                          </p>
                          <p className="text-gray-900 text-sm leading-relaxed">
                            {battle.battleLog.reasoning}
                          </p>
                        </div>

                        {/* Battle Narrative Section */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>📖</span>
                            <span>Narrativa da Batalha:</span>
                          </p>
                          <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                            {battle.battleLog.battleNarrative}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
