import { z } from "zod";

export const moveSchema = z.object({
  name: z.string().min(1, "Move name is required"),
  nameFr: z.string().optional(),
  type: z.enum(["learned", "random", "custom"]),
});

export const pokemonFormSchema = z.object({
  pokemonId: z.number().int().min(1).max(493, "Pokemon ID must be between 1 and 493"),
  pokemonName: z.string().min(1, "Pokemon name is required"),
  pokemonNameFr: z.string().optional(),
  nickname: z.string().max(100).optional(),
  gender: z.enum(["male", "female", "genderless"], {
    message: "Gender is required",
  }),
  isShiny: z.boolean(),
  moves: z.array(moveSchema).length(4, "Exactly 4 moves are required"),
  creatorName: z.string().min(1, "Creator name is required").max(100),
  spriteUrl: z.string().url().optional(),
});

export type PokemonFormData = z.infer<typeof pokemonFormSchema>;
