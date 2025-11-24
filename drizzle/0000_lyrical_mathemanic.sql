CREATE TABLE "created_pokemons" (
	"id" serial PRIMARY KEY NOT NULL,
	"pokemon_id" integer NOT NULL,
	"pokemon_name" varchar(100) NOT NULL,
	"nickname" varchar(100),
	"gender" varchar(20) NOT NULL,
	"is_shiny" boolean DEFAULT false NOT NULL,
	"moves" jsonb NOT NULL,
	"creator_name" varchar(100) NOT NULL,
	"sprite_url" varchar(255),
	"created_at" timestamp DEFAULT now()
);
