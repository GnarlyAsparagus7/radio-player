"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Radio } from "lucide-react";
import { Station } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface StationListProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  loading?: boolean;
}

export function StationList({ stations, onSelectStation, loading }: StationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-96 h-[calc(100vh-8rem)] bg-background/80 backdrop-blur-lg">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-5rem)] rounded-md">
        <div className="p-4 pt-0 flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-3 p-3">
                <Skeleton className="w-10 h-10 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : filteredStations.length > 0 ? (
            filteredStations.map((station, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex items-start gap-3 h-auto p-3 justify-start"
                onClick={() => onSelectStation(station)}
              >
                {station.favicon ? (
                  <img
                    src={station.favicon}
                    alt={station.name}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/40x40";
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <Radio className="h-5 w-5" />
                  </div>
                )}
                <div className="text-left">
                  <h3 className="font-medium">{station.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {station.tags || "No tags"} • {station.bitrate || "Unknown"}kbps • {station.codec || "Unknown"}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No stations found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}