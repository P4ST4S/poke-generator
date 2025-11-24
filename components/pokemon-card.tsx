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

  const genderColor = {
    male: "text-blue-600",
    female: "text-pink-600",
    genderless: "text-gray-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-800">
            {pokemon.nickname || pokemon.pokemonNameFr || pokemon.pokemonName}
          </h3>
          <span className={`text-2xl ${genderColor[pokemon.gender as keyof typeof genderColor]}`}>
            {genderSymbol[pokemon.gender as keyof typeof genderSymbol]}
          </span>
          {pokemon.isShiny && <span className="text-xl">✨</span>}
        </div>
        <span className="text-sm text-gray-500">
          #{pokemon.pokemonId.toString().padStart(3, "0")}
        </span>
      </div>

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
        <p className="text-center text-sm text-gray-600 mb-4">
          ({pokemon.pokemonNameFr || pokemon.pokemonName})
        </p>
      )}

      {/* Capacités */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-700">Capacités:</h4>
        <div className="grid grid-cols-1 gap-1">
          {(pokemon.moves as Array<{ name: string; nameFr?: string; type: string }>).map((move, index) => (
            <div
              key={index}
              className="text-sm px-3 py-1 bg-gray-100 rounded-md"
            >
              <span className="capitalize">
                {move.type === "random"
                  ? "🎲 Aléatoire"
                  : (move.nameFr || move.name)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Par:</span>
          {isCreatorRevealed ? (
            <span className="font-medium">{pokemon.creatorName}</span>
          ) : (
            <button
              onClick={() => setIsCreatorRevealed(true)}
              className="px-3 py-1 bg-gray-800 text-gray-800 rounded cursor-pointer hover:bg-gray-700 transition-colors select-none"
              title="Cliquer pour révéler"
            >
              ████████
            </button>
          )}
        </div>
        {pokemon.createdAt && (
          <span className="text-xs">
            {new Date(pokemon.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
