"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/favorites";
import { Station } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FavoriteStationsProps {
  onSelectStation: (station: Station) => void;
}

export function FavoriteStations({ onSelectStation }: FavoriteStationsProps) {
  const [favorites, setFavorites] = useState<Station[]>([]);

  useEffect(() => {
    // Update favorites when component mounts and when localStorage changes
    const updateFavorites = () => {
      setFavorites(getFavorites());
    };

    updateFavorites();

    window.addEventListener("storage", updateFavorites);
    return () => window.removeEventListener("storage", updateFavorites);
  }, []);

  if (favorites.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No favorite stations yet
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {favorites.map((station) => (
          <Card
            key={station.url}
            className="p-2 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onSelectStation(station)}
          >
            <div className="flex items-center gap-2">
              {station.favicon && (
                <img
                  src={station.favicon}
                  alt={station.name}
                  className="w-8 h-8 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/32x32";
                  }}
                />
              )}
              <div className="overflow-hidden">
                <h4 className="font-medium truncate">{station.name}</h4>
                <p className="text-xs text-muted-foreground truncate">
                  {station.tags}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
