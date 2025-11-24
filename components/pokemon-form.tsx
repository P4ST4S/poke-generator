"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { pokemonFormSchema, type PokemonFormData } from "@/lib/validations/pokemon";
import { createPokemon } from "@/lib/actions/pokemon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import type { PokemonListItem, PokemonMove } from "@/lib/api/pokeapi";

interface PokemonFormProps {
  pokemonList: PokemonListItem[];
}

interface SelectedPokemonData {
  name: string;
  nameFr: string;
  spriteDefault: string | null;
  spriteShiny: string | null;
  moves: PokemonMove[];
}

export function PokemonForm({ pokemonList }: PokemonFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemonData | null>(null);
  const [allMoves, setAllMoves] = useState<PokemonMove[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PokemonFormData>({
    resolver: zodResolver(pokemonFormSchema),
    defaultValues: {
      isShiny: false,
      gender: "male",
      moves: [
        { name: "", type: "learned", nameFr: "" },
        { name: "", type: "learned", nameFr: "" },
        { name: "", type: "learned", nameFr: "" },
        { name: "", type: "learned", nameFr: "" },
      ],
    },
  });

  const watchedPokemonId = watch("pokemonId");
  const watchedIsShiny = watch("isShiny");
  const watchedMoves = watch("moves");

  // Charge toutes les capacités au montage du composant
  useEffect(() => {
    fetch("/api/moves")
      .then((res) => res.json())
      .then((data) => setAllMoves(data))
      .catch((err) => console.error("Error fetching all moves:", err));
  }, []);

  // Charge les détails du Pokémon sélectionné avec les noms français
  const handlePokemonChange = async (pokemonId: number) => {
    if (!pokemonId || pokemonId < 1 || pokemonId > 493) return;

    try {
      const response = await fetch(`/api/pokemon/${pokemonId}`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      setSelectedPokemon({
        name: data.name,
        nameFr: data.nameFr,
        spriteDefault: data.sprites.front_default,
        spriteShiny: data.sprites.front_shiny,
        moves: data.movesFr,
      });

      setValue("pokemonName", data.name);
      setValue("pokemonNameFr", data.nameFr);
      setValue("spriteUrl", data.sprites.front_default || undefined);
    } catch (err) {
      console.error("Error fetching pokemon:", err);
      setError("Impossible de charger les détails du Pokémon");
    }
  };

  const onSubmit = (data: PokemonFormData) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createPokemon(data);

      if (result.success) {
        setSuccess(true);
        reset();
        setSelectedPokemon(null);
      } else {
        setError(result.error);
      }
    });
  };

  const getSpriteUrl = () => {
    if (!selectedPokemon) return null;
    return watchedIsShiny
      ? selectedPokemon.spriteShiny || selectedPokemon.spriteDefault
      : selectedPokemon.spriteDefault;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white drop-shadow-[3px_3px_0px_rgba(59,163,212,1)]">
          Générateur Egglocke
        </h1>
        <Link href="/created">
          <Button
            variant="outline"
            className="bg-pokemon-blue text-white border-2 border-pokemon-dark-blue hover:bg-pokemon-dark-blue font-bold text-xs"
          >
            Voir Pokémon →
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-[8px_8px_0px_0px_rgba(59,76,202,0.3)] border-4 border-pokemon-blue">

      {error && (
        <div className="bg-pokemon-red text-white px-4 py-3 rounded border-2 border-red-800 text-xs font-bold">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 text-white px-4 py-3 rounded border-2 border-green-700 text-xs font-bold">
          Pokémon créé avec succès !
        </div>
      )}

      {/* Sélection du Pokémon */}
      <div className="space-y-2">
        <Label htmlFor="pokemonId">Pokémon</Label>
        <Combobox
          options={pokemonList.map((pokemon) => ({
            value: pokemon.id.toString(),
            label: `#${pokemon.id.toString().padStart(3, "0")} - ${pokemon.nameFr}`,
          }))}
          value={watchedPokemonId?.toString()}
          onChange={(value) => {
            const pokemonId = Number(value);
            setValue("pokemonId", pokemonId);
            handlePokemonChange(pokemonId);
          }}
          placeholder="Rechercher un Pokémon..."
        />
        {errors.pokemonId && (
          <p className="text-sm text-red-600">{errors.pokemonId.message}</p>
        )}
      </div>

      {/* Sprite du Pokémon */}
      {selectedPokemon && (
        <div className="flex flex-col items-center gap-2">
          <img
            src={getSpriteUrl() || ""}
            alt={selectedPokemon.nameFr}
            className="w-32 h-32"
            style={{ imageRendering: "pixelated" }}
          />
          <p className="text-lg font-semibold text-gray-700">{selectedPokemon.nameFr}</p>
        </div>
      )}

      {/* Surnom */}
      <div className="space-y-2">
        <Label htmlFor="nickname">Surnom (OBLIGATOIRE!!)</Label>
        <Input id="nickname" {...register("nickname")} placeholder="Entrez un surnom" />
        {errors.nickname && (
          <p className="text-sm text-red-600">{errors.nickname.message}</p>
        )}
      </div>

      {/* Genre */}
      <div className="space-y-2">
        <Label>Genre</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="male" {...register("gender")} className="w-4 h-4" />
            <span>Mâle</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="female" {...register("gender")} className="w-4 h-4" />
            <span>Femelle</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="genderless" {...register("gender")} className="w-4 h-4" />
            <span>Asexué</span>
          </label>
        </div>
        {errors.gender && (
          <p className="text-sm text-red-600">{errors.gender.message}</p>
        )}
      </div>

      {/* Shiny */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("isShiny")} className="w-4 h-4" />
          <span className="text-sm font-medium">Shiny ✨</span>
        </label>
      </div>

      {/* Capacités */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Capacités (4 requises)</Label>
          <span className="text-xs text-gray-500 italic">Astuce: Choisissez "Aléatoire" pour une capacité surprise</span>
        </div>
        {[0, 1, 2, 3].map((index) => {
          // Créer une liste combinée avec démarcation
          const learnedMoves = selectedPokemon?.moves.map((move) => ({
            value: move.name,
            label: move.nameFr,
          })) || [];

          const otherMoves = allMoves
            .filter((move) => !learnedMoves.some((lm) => lm.value === move.name))
            .map((move) => ({
              value: move.name,
              label: move.nameFr,
            }));

          const allMovesOptions = [
            ...learnedMoves,
            ...(learnedMoves.length > 0 && otherMoves.length > 0
              ? [{ value: "__separator__", label: "Autres capacités", isSeparator: true }]
              : []),
            ...otherMoves,
          ];

          return (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <Select
                  {...register(`moves.${index}.type` as const)}
                  className="w-40"
                  disabled={!selectedPokemon}
                  onChange={(e) => {
                    const newType = e.target.value as "learned" | "random";
                    setValue(`moves.${index}.type`, newType);

                    // Si on passe en mode aléatoire, générer immédiatement une capacité
                    if (newType === "random" && allMoves.length > 0) {
                      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
                      setValue(`moves.${index}.name`, randomMove.name);
                      setValue(`moves.${index}.nameFr`, randomMove.nameFr);
                    }
                  }}
                >
                  <option value="learned">Capacité</option>
                  <option value="random">Aléatoire</option>
                </Select>

                {watchedMoves[index]?.type === "learned" && (
                  <>
                    <Combobox
                      options={allMovesOptions}
                      value={watchedMoves[index]?.name}
                      onChange={(value) => {
                        setValue(`moves.${index}.name`, value);
                        const selectedMove = [...learnedMoves, ...otherMoves].find((m) => m.value === value);
                        if (selectedMove) {
                          setValue(`moves.${index}.nameFr`, selectedMove.label);
                        }
                      }}
                      placeholder="Rechercher une capacité..."
                      disabled={!selectedPokemon}
                      className="flex-1"
                    />
                    <input
                      type="hidden"
                      {...register(`moves.${index}.nameFr` as const)}
                    />
                  </>
                )}

                {watchedMoves[index]?.type === "random" && (
                  <>
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={watchedMoves[index]?.nameFr || "Capacité aléatoire"}
                        readOnly
                        className="flex-1 bg-white text-gray-900 cursor-default"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (allMoves.length === 0) return;
                          const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
                          setValue(`moves.${index}.name`, randomMove.name);
                          setValue(`moves.${index}.nameFr`, randomMove.nameFr);
                        }}
                        className="px-3"
                        title="Générer une capacité aléatoire"
                      >
                        🎲
                      </Button>
                    </div>
                    <input
                      type="hidden"
                      {...register(`moves.${index}.name` as const)}
                    />
                    <input
                      type="hidden"
                      {...register(`moves.${index}.nameFr` as const)}
                    />
                  </>
                )}
              </div>
              {errors.moves?.[index]?.name && (
                <p className="text-sm text-red-600">
                  {errors.moves[index]?.name?.message}
                </p>
              )}
            </div>
          );
        })}
        {errors.moves && !Array.isArray(errors.moves) && (
          <p className="text-sm text-red-600">{errors.moves.message}</p>
        )}
      </div>

      {/* Créateur */}
      <div className="space-y-2">
        <Label htmlFor="creatorName">Nom du créateur</Label>
        <Input
          id="creatorName"
          {...register("creatorName")}
          placeholder="Votre nom"
        />
        {errors.creatorName && (
          <p className="text-sm text-red-600">{errors.creatorName.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-pokemon-red hover:bg-red-700 text-white font-bold py-3 text-sm border-4 border-red-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1"
      >
        {isPending ? "Création..." : "Créer le Pokémon"}
      </Button>
    </form>
    </div>
  );
}
