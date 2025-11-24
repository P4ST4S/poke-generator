"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createdPokemons, type CreatedPokemon } from "@/lib/db/schema";
import { pokemonFormSchema, type PokemonFormData } from "@/lib/validations/pokemon";
import { getCachedPokemonDetails } from "@/lib/api/pokeapi";
import { desc } from "drizzle-orm";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPokemon(
  data: PokemonFormData
): Promise<ActionResult<{ id: number }>> {
  try {
    // Validation avec Zod
    const validatedData = pokemonFormSchema.parse(data);

    // Vérification que le Pokémon existe bien
    const pokemonDetails = await getCachedPokemonDetails(validatedData.pokemonId);
    if (!pokemonDetails) {
      return {
        success: false,
        error: "Pokemon not found",
      };
    }

    // Vérification que les moves "learned" existent bien pour ce Pokémon
    const learnedMoves = validatedData.moves
      .filter((m) => m.type === "learned")
      .map((m) => m.name);

    const pokemonMoveNames = pokemonDetails.moves.map((m) => m.move.name);
    const invalidMoves = learnedMoves.filter(
      (moveName) => !pokemonMoveNames.includes(moveName)
    );

    if (invalidMoves.length > 0) {
      return {
        success: false,
        error: `Invalid moves for this Pokemon: ${invalidMoves.join(", ")}`,
      };
    }

    // Sélection du sprite approprié
    const spriteUrl = validatedData.isShiny
      ? pokemonDetails.sprites.front_shiny || pokemonDetails.sprites.front_default
      : pokemonDetails.sprites.front_default;

    // Insertion en DB
    const [inserted] = await db
      .insert(createdPokemons)
      .values({
        pokemonId: validatedData.pokemonId,
        pokemonName: validatedData.pokemonName,
        pokemonNameFr: validatedData.pokemonNameFr || null,
        nickname: validatedData.nickname || null,
        gender: validatedData.gender,
        isShiny: validatedData.isShiny,
        moves: validatedData.moves,
        creatorName: validatedData.creatorName,
        spriteUrl: spriteUrl || null,
      })
      .returning({ id: createdPokemons.id });

    revalidatePath("/");
    revalidatePath("/created");

    return {
      success: true,
      data: { id: inserted.id },
    };
  } catch (error) {
    console.error("Error creating pokemon:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function getCreatedPokemons(): Promise<CreatedPokemon[]> {
  try {
    const pokemons = await db
      .select()
      .from(createdPokemons)
      .orderBy(desc(createdPokemons.createdAt));

    return pokemons;
  } catch (error) {
    console.error("Error fetching created pokemons:", error);
    return [];
  }
}
