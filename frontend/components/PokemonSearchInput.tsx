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
 * Implementa lazy loading para renderizar até 1350 pokémons com performance
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
  const [displayCount, setDisplayCount] = useState(50); // Lazy loading inicial
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Reset display count ao filtrar
    setDisplayCount(50);
  }, [searchTerm, pokemonList]);

  // Lazy loading ao fazer scroll no dropdown
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdown;
      // Se o usuário scrollou até 80% da lista, carrega mais
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setDisplayCount((prev) => Math.min(prev + 50, filteredPokemon.length));
      }
    };

    dropdown.addEventListener('scroll', handleScroll);
    return () => dropdown.removeEventListener('scroll', handleScroll);
  }, [filteredPokemon.length]);

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

  const handleClear = () => {
    setSearchTerm('');
    onChange('', '');
    setIsOpen(false);
  };

  // Permite usar o valor digitado mesmo que não esteja na lista
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Se o usuário pressionar Enter, usa o valor digitado como ID/nome do pokémon
      onChange(searchTerm.toLowerCase().trim(), searchTerm.toLowerCase().trim());
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
          title="Digite e selecione da lista ou pressione Enter para usar qualquer pokémon por nome/ID"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpar busca"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown com lista filtrada e lazy loading */}
      {isOpen && filteredPokemon.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredPokemon.slice(0, displayCount).map((pokemon) => (
            <button
              key={pokemon.id}
              type="button"
              onClick={() => handleSelect(pokemon)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors"
            >
              {/* Miniatura do Pokémon servida pelo backend */}
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-10 h-10 object-contain"
                loading="lazy"
              />

              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-gray-500 font-mono">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
                <span className="font-medium text-gray-900 capitalize">{pokemon.name}</span>
              </div>

              <div className="flex gap-1">
                {pokemon.types.slice(0, 2).map((type) => (
                  <span
                    key={type}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </button>
          ))}

          {/* Indicador de loading incremental */}
          {displayCount < filteredPokemon.length && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center bg-gray-50 border-t border-gray-200">
              Mostrando {displayCount} de {filteredPokemon.length} resultados. Scroll para ver mais...
            </div>
          )}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {isOpen && searchTerm && filteredPokemon.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-gray-500 text-center mb-2">
            Pokémon "{searchTerm}" não encontrado na lista inicial
          </p>
          <p className="text-xs text-gray-400 text-center">
            Pressione <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">Enter</kbd> para usar este nome/ID mesmo assim
          </p>
        </div>
      )}
    </div>
  );
}
