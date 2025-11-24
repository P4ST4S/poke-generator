import { PokemonForm } from "@/components/pokemon-form";
import { getCachedPokemonList } from "@/lib/api/pokeapi";

export default async function Home() {
  const pokemonList = await getCachedPokemonList();

  return (
    <div className="min-h-screen bg-linear-to-b from-pokemon-light-blue to-pokemon-blue py-12">
      <PokemonForm pokemonList={pokemonList} />
    </div>
  );
}
