import Link from "next/link";
import { getCreatedPokemons } from "@/lib/actions/pokemon";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";

export default async function CreatedPage() {
  const pokemons = await getCreatedPokemons();

  return (
    <div className="min-h-screen bg-linear-to-b from-pokemon-light-blue to-pokemon-blue py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-[3px_3px_0px_rgba(59,163,212,1)] mb-2">
              Pokémon Créés
            </h1>
            <p className="text-white font-bold text-xs">
              {pokemons.length} Pokémon{pokemons.length > 1 ? "s" : ""} créé{pokemons.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="bg-pokemon-blue text-white border-2 border-pokemon-dark-blue hover:bg-pokemon-dark-blue font-bold text-xs"
            >
              ← Créer nouveau
            </Button>
          </Link>
        </div>

        {/* Grid */}
        {pokemons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-4 border-pokemon-blue shadow-[8px_8px_0px_0px_rgba(59,76,202,0.3)]">
            <p className="text-pokemon-blue font-bold text-sm mb-4">
              Aucun Pokémon créé
            </p>
            <Link href="/">
              <Button className="bg-pokemon-red hover:bg-red-700 text-white font-bold text-xs border-2 border-red-800">
                Créer mon premier
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
