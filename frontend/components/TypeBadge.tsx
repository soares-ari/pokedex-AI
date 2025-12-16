interface TypeBadgeProps {
  type: string;
}

/**
 * Mapeamento de cores oficiais dos tipos de Pokémon
 * Cada tipo possui uma cor específica baseada nos jogos oficiais
 */
const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-400 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-600 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-amber-700 text-white',
  ghost: 'bg-purple-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

/**
 * Badge que exibe o tipo do pokémon com cor correspondente
 * Usa as cores oficiais dos tipos de Pokémon
 */
export function TypeBadge({ type }: TypeBadgeProps) {
  const colorClass = TYPE_COLORS[type.toLowerCase()] || 'bg-gray-400 text-white';

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-sm ${colorClass}`}
    >
      {type}
    </span>
  );
}
