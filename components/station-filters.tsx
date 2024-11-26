"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchCountries, fetchTags } from "@/lib/radio-browser";

interface StationFiltersProps {
  onCountrySelect: (country: string) => void;
  onGenreSelect: (genre: string) => void;
  selectedCountry: string | null;
}

export function StationFilters({
  onCountrySelect,
  onGenreSelect,
  selectedCountry,
}: StationFiltersProps) {
  const [open, setOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [countriesData, tagsData] = await Promise.all([
          fetchCountries(),
          fetchTags(),
        ]);
        setCountries(countriesData);
        setGenres(tagsData.slice(0, 100)); // Get top 100 genres
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    };

    loadFilters();
  }, []);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedCountry || "Select country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {countries.map((country) => (
                <CommandItem
                  key={country}
                  value={country}
                  onSelect={() => {
                    onCountrySelect(country);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry === country ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={genreOpen} onOpenChange={setGenreOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={genreOpen}
            className="w-[200px] justify-between"
          >
            {selectedGenre || "Select genre..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search genre..." />
            <CommandEmpty>No genre found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {genres.map((genre) => (
                <CommandItem
                  key={genre}
                  value={genre.toLowerCase().replace(/[^a-z0-9]/g, '')}
                  onSelect={() => {
                    setSelectedGenre(genre);
                    onGenreSelect(genre);
                    setGenreOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedGenre === genre ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {genre}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}