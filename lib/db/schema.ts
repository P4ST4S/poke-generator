import { pgTable, serial, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const createdPokemons = pgTable("created_pokemons", {
  id: serial("id").primaryKey().notNull(),
  pokemonId: integer("pokemon_id").notNull(),
  pokemonName: varchar("pokemon_name", { length: 100 }).notNull(),
  pokemonNameFr: varchar("pokemon_name_fr", { length: 100 }),
  nickname: varchar("nickname", { length: 100 }),
  gender: varchar("gender", { length: 20 }).notNull(), // 'male', 'female', 'genderless'
  isShiny: boolean("is_shiny").notNull().default(false),
  moves: jsonb("moves").notNull().$type<Array<{
    name: string;
    nameFr?: string;
    type: "learned" | "random";
  }>>(),
  creatorName: varchar("creator_name", { length: 100 }).notNull(),
  spriteUrl: varchar("sprite_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type CreatedPokemon = typeof createdPokemons.$inferSelect;
export type NewCreatedPokemon = typeof createdPokemons.$inferInsert;
