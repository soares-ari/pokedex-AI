import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TypeBadge } from './TypeBadge';
import { PokemonListItem } from '@/lib/api';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

/**
 * Card de pokémon exibido na listagem
 * Mostra imagem, nome, número e tipos do pokémon
 * Ao clicar, navega para a página de detalhes
 * Botão "Batalhar" navega para Battle Arena com pokémon pré-selecionado
 */
export function PokemonCard({ pokemon }: PokemonCardProps) {
  const router = useRouter();

  const handleBattleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/battle?pokemon1=${pokemon.id}`);
  };

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-transparent hover:border-blue-400 cursor-pointer group">{
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
          <div className="flex gap-2 flex-wrap mb-3">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>

          {/* Botão Batalhar */}
          <button
            onClick={handleBattleClick}
            className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-red-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
            title="Batalhar com este pokémon"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Batalhar
          </button>
        </div>
      </div>
    </Link>
  );
}
