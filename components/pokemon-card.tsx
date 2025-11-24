"use client";

import { useState } from "react";
import type { CreatedPokemon } from "@/lib/db/schema";

interface PokemonCardProps {
  pokemon: CreatedPokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [isCreatorRevealed, setIsCreatorRevealed] = useState(false);
  const genderSymbol = {
    male: "♂",
    female: "♀",
    genderless: "⚲",
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border-4 border-pokemon-blue shadow-[6px_6px_0px_0px_rgba(59,163,212,1)] hover:shadow-[8px_8px_0px_0px_rgba(59,163,212,1)] transition-all hover:-translate-y-1">
      {/* Header avec fond coloré */}
      <div className="p-4 bg-pokemon-blue">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              {pokemon.nickname || pokemon.pokemonNameFr || pokemon.pokemonName}
            </h3>
            <span className={`text-xl ${pokemon.gender === 'male' ? 'text-white' : pokemon.gender === 'female' ? 'text-pink-300' : 'text-gray-300'}`}>
              {genderSymbol[pokemon.gender as keyof typeof genderSymbol]}
            </span>
            {pokemon.isShiny && <span className="text-xl text-yellow-400">★</span>}
          </div>
          <span className="text-xs font-bold text-white bg-pokemon-dark-blue px-2 py-1 rounded border-2 border-white">
            #{pokemon.pokemonId.toString().padStart(3, "0")}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Sprite */}
        {pokemon.spriteUrl && (
          <div className="flex justify-center mb-4">
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.pokemonNameFr || pokemon.pokemonName}
            className="w-24 h-24"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

        {/* Nom original si surnom existe */}
        {pokemon.nickname && (
          <p className="text-center text-xs text-gray-600 mb-4">
            ({pokemon.pokemonNameFr || pokemon.pokemonName})
          </p>
        )}

        {/* Capacités */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-bold text-pokemon-blue">Capacités:</h4>
          <div className="grid grid-cols-1 gap-2">
            {(pokemon.moves as Array<{ name: string; nameFr?: string; type: string }>).map((move, index) => (
              <div
                key={index}
                className="text-xs px-2 py-1 bg-pokemon-yellow border-2 border-yellow-600 rounded font-bold shadow-[2px_2px_0px_0px_rgba(180,140,0,1)]"
              >
                <span className="capitalize text-gray-800">
                  {(move.nameFr || move.name)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-pokemon-blue pt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-pokemon-blue">Par:</span>
            {isCreatorRevealed ? (
              <span className="font-bold text-pokemon-dark-blue">{pokemon.creatorName}</span>
            ) : (
              <button
                onClick={() => setIsCreatorRevealed(true)}
                className="px-2 py-1 bg-pokemon-dark-blue text-white rounded cursor-pointer hover:bg-pokemon-blue transition-colors select-none font-bold border-2 border-pokemon-blue shadow-[2px_2px_0px_0px_rgba(59,163,212,1)]"
                title="Cliquer pour révéler"
              >
                🔒 Révéler
              </button>
            )}
          </div>
          {pokemon.createdAt && (
            <span className="text-xs font-bold text-gray-500">
              {new Date(pokemon.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
