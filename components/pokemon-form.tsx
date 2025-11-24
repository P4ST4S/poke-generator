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
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Générateur Egglocke</h1>
        <Link href="/created">
          <Button variant="outline">
            Voir les Pokémon créés →
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-lg">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
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
        <Label htmlFor="nickname">Surnom</Label>
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
        <Label>Capacités (4 requises)</Label>
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
                  className="w-32"
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
                    <Input
                      value="Capacité aléatoire"
                      disabled
                      className="flex-1"
                      {...register(`moves.${index}.name` as const, {
                        value: "random",
                      })}
                    />
                    <input
                      type="hidden"
                      {...register(`moves.${index}.nameFr` as const, {
                        value: "Capacité aléatoire",
                      })}
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
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Création en cours..." : "Créer le Pokémon"}
      </Button>
    </form>
    </div>
  );
}
