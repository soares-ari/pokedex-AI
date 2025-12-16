import Link from 'next/link';
import Image from 'next/image';
import { TypeBadge } from './TypeBadge';
import { PokemonListItem } from '@/lib/api';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

/**
 * Card de pokémon exibido na listagem
 * Mostra imagem, nome, número e tipos do pokémon
 * Ao clicar, navega para a página de detalhes
 */
export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-transparent hover:border-blue-400 cursor-pointer">
        {/* Imagem do pokémon com gradiente de fundo */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={120}
            height={120}
            className="object-contain"
            unoptimized
          />
          {/* Badge com número do pokémon */}
          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-bold text-gray-600">
            #{String(pokemon.id).padStart(3, '0')}
          </div>
        </div>

        {/* Informações do pokémon */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 capitalize mb-2">
            {pokemon.name}
          </h3>
          {/* Badges de tipos */}
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
