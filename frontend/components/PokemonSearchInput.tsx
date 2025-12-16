import { useState, useRef, useEffect } from 'react';
import { PokemonListItem } from '@/lib/api';

interface PokemonSearchInputProps {
  pokemonList: PokemonListItem[];
  value: string;
  onChange: (pokemonId: string, pokemonName: string) => void;
  placeholder: string;
  label: string;
}

/**
 * Input de busca de Pokémon com dropdown filtrado
 * Permite digitar e filtrar a lista de Pokémons em tempo real
 */
export function PokemonSearchInput({
  pokemonList,
  value,
  onChange,
  placeholder,
  label,
}: PokemonSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtra pokémons baseado no termo de busca
  useEffect(() => {
    if (!pokemonList || pokemonList.length === 0) {
      setFilteredPokemon([]);
      return;
    }

    if (searchTerm.trim() === '') {
      setFilteredPokemon(pokemonList);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = pokemonList.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.id.toString().includes(term)
      );
      setFilteredPokemon(filtered);
    }
  }, [searchTerm, pokemonList]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (pokemon: PokemonListItem) => {
    setSearchTerm(pokemon.name);
    onChange(pokemon.id.toString(), pokemon.name);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
      />

      {/* Dropdown com lista filtrada */}
      {isOpen && filteredPokemon.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredPokemon.slice(0, 50).map((pokemon) => (
            <button
              key={pokemon.id}
              type="button"
              onClick={() => handleSelect(pokemon)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 capitalize flex items-center gap-2 transition-colors"
            >
              <span className="text-xs text-gray-500 font-mono">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
              <span className="font-medium text-gray-900">{pokemon.name}</span>
              <div className="ml-auto flex gap-1">
                {pokemon.types.slice(0, 2).map((type) => (
                  <span
                    key={type}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {filteredPokemon.length > 50 && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              ... e mais {filteredPokemon.length - 50} resultados
            </div>
          )}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {isOpen && searchTerm && filteredPokemon.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Nenhum Pokémon encontrado
        </div>
      )}
    </div>
  );
}
