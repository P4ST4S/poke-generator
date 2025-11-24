import Link from "next/link";
import { getCreatedPokemons } from "@/lib/actions/pokemon";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";

export default async function CreatedPage() {
  const pokemons = await getCreatedPokemons();

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Pokémon Créés
            </h1>
            <p className="text-gray-600">
              {pokemons.length} Pokémon{pokemons.length > 1 ? "s" : ""} créé{pokemons.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              ← Créer un nouveau Pokémon
            </Button>
          </Link>
        </div>

        {/* Grid */}
        {pokemons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              Aucun Pokémon créé pour le moment
            </p>
            <Link href="/">
              <Button>Créer mon premier Pokémon</Button>
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
