import { PokemonForm } from "@/components/pokemon-form";
import { getCachedPokemonList } from "@/lib/api/pokeapi";

export default async function Home() {
  const pokemonList = await getCachedPokemonList();

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 py-12">
      <PokemonForm pokemonList={pokemonList} />
    </div>
  );
}
