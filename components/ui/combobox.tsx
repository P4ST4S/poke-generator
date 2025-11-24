"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ComboboxOption {
  value: string;
  label: string;
  isSeparator?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  disabled = false,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrer les options en fonction de la recherche (garder les séparateurs si au moins une option avant ou après est visible)
  const filteredOptions = options.filter((option, idx, arr) => {
    if (option.isSeparator) {
      // Garder le séparateur si au moins une option avant ou après correspond à la recherche
      const hasMatchBefore = arr.slice(0, idx).some((opt) =>
        !opt.isSeparator && opt.label.toLowerCase().includes(search.toLowerCase())
      );
      const hasMatchAfter = arr.slice(idx + 1).some((opt) =>
        !opt.isSeparator && opt.label.toLowerCase().includes(search.toLowerCase())
      );
      return hasMatchBefore && hasMatchAfter;
    }
    return option.label.toLowerCase().includes(search.toLowerCase());
  });

  // Trouver le label de la valeur sélectionnée
  const selectedOption = options.find((opt) => opt.value === value && !opt.isSeparator);
  const displayValue = selectedOption ? selectedOption.label : search;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setSearch("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="text"
        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={isOpen ? search : displayValue}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
      />

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Aucun résultat trouvé
            </div>
          ) : (
            filteredOptions.map((option) =>
              option.isSeparator ? (
                <div
                  key={option.value}
                  className="px-3 py-2 border-t-2 border-gray-300 text-xs text-gray-500 font-semibold uppercase tracking-wide"
                >
                  {option.label}
                </div>
              ) : (
                <div
                  key={option.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer hover:bg-blue-50",
                    option.value === value && "bg-blue-100 font-medium"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
