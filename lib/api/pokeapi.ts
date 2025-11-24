import { unstable_cache } from "next/cache";

export interface PokemonListItem {
  id: number;
  name: string;
  nameFr: string;
  spriteUrl: string;
}

export interface PokemonMove {
  name: string;
  nameFr: string;
  url: string;
}

interface PokeAPIName {
  name: string;
  language: {
    name: string;
  };
}

interface PokeAPISpecies {
  names: PokeAPIName[];
}

interface PokeAPIMoveDetail {
  name: string;
  names: PokeAPIName[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  nameFr: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
  };
  species: {
    url: string;
  };
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
}

// Récupère le nom français depuis l'API species
async function getFrenchName(speciesUrl: string): Promise<string> {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) return "";
    const data: PokeAPISpecies = await response.json();
    const frenchName = data.names.find((n) => n.language.name === "fr");
    return frenchName?.name || "";
  } catch {
    return "";
  }
}

// Récupère le nom français d'une attaque
async function getFrenchMoveName(moveUrl: string): Promise<string> {
  try {
    const response = await fetch(moveUrl);
    if (!response.ok) return "";
    const data: PokeAPIMoveDetail = await response.json();
    const frenchName = data.names.find((n) => n.language.name === "fr");
    return frenchName?.name || "";
  } catch {
    return "";
  }
}

// Cache la liste des Pokémons pour 24h
export const getCachedPokemonList = unstable_cache(
  async (): Promise<PokemonListItem[]> => {
    const promises = Array.from({ length: 493 }, (_, i) => i + 1).map(async (id) => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) return null;
        const data = await response.json();

        // Récupère le nom français
        const nameFr = await getFrenchName(data.species.url);

        return {
          id: data.id,
          name: data.name,
          nameFr: nameFr || data.name,
          spriteUrl: data.sprites.front_default || "",
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((p): p is PokemonListItem => p !== null);
  },
  ["pokemon-list-fr"],
  {
    revalidate: 86400, // 24 heures
    tags: ["pokemon-list"],
  }
);

// Cache les détails d'un Pokémon pour 24h
export const getCachedPokemonDetails = unstable_cache(
  async (id: number): Promise<(PokemonDetails & { movesFr: PokemonMove[] }) | null> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) return null;
      const data = await response.json();

      // Récupère le nom français du Pokémon
      const nameFr = await getFrenchName(data.species.url);

      // Récupère les noms français des attaques
      const movesPromises = data.moves.map(async (m: any) => {
        const moveFr = await getFrenchMoveName(m.move.url);
        return {
          name: m.move.name,
          nameFr: moveFr || m.move.name,
          url: m.move.url,
        };
      });

      const movesFr = await Promise.all(movesPromises);

      return {
        id: data.id,
        name: data.name,
        nameFr: nameFr || data.name,
        sprites: data.sprites,
        species: data.species,
        moves: data.moves,
        movesFr,
      };
    } catch {
      return null;
    }
  },
  ["pokemon-details-fr"],
  {
    revalidate: 86400,
    tags: ["pokemon-details"],
  }
);

// Cache toutes les capacités disponibles pour 24h
export const getCachedAllMoves = unstable_cache(
  async (): Promise<PokemonMove[]> => {
    try {
      // Récupère la liste de toutes les capacités (limit=1000 pour être sûr de tout avoir)
      const response = await fetch("https://pokeapi.co/api/v2/move?limit=1000");
      if (!response.ok) return [];
      const data = await response.json();

      // Récupère les noms français pour chaque capacité
      const movesPromises = data.results.map(async (move: { name: string; url: string }) => {
        const moveFr = await getFrenchMoveName(move.url);
        return {
          name: move.name,
          nameFr: moveFr || move.name,
          url: move.url,
        };
      });

      const moves = await Promise.all(movesPromises);
      return moves.sort((a, b) => a.nameFr.localeCompare(b.nameFr, "fr"));
    } catch {
      return [];
    }
  },
  ["all-moves-fr"],
  {
    revalidate: 86400,
    tags: ["all-moves"],
  }
);
