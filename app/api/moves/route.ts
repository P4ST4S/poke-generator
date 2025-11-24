import { NextResponse } from "next/server";
import { getCachedAllMoves } from "@/lib/api/pokeapi";

export async function GET() {
  try {
    const moves = await getCachedAllMoves();
    return NextResponse.json(moves);
  } catch (error) {
    console.error("Error fetching moves:", error);
    return NextResponse.json({ error: "Failed to fetch moves" }, { status: 500 });
  }
}
