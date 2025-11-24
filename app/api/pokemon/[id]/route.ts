import { NextRequest, NextResponse } from "next/server";
import { getCachedPokemonDetails } from "@/lib/api/pokeapi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pokemonId = parseInt(id, 10);

    if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 493) {
      return NextResponse.json(
        { error: "Invalid Pokemon ID" },
        { status: 400 }
      );
    }

    const pokemonDetails = await getCachedPokemonDetails(pokemonId);

    if (!pokemonDetails) {
      return NextResponse.json(
        { error: "Pokemon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pokemonDetails);
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
