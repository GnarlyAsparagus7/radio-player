"use client";

import { useState, useEffect } from "react";
import WorldMap from "@/components/world-map";
import { StationList } from "@/components/station-list";
import { RadioPlayer } from "@/components/radio-player";
import { FavoriteStations } from "@/components/favorite-stations"; 
import { useToast } from "@/components/ui/use-toast";
import { CollapsiblePanel } from "@/components/collapsible-panel"; 
import {
  fetchStationsByCountry,
  fetchTopStations,
} from "@/lib/radio-browser";
import { Station } from "@/lib/types";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStationsPanelExpanded, setIsStationsPanelExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTopStations();
  }, []);

  const loadTopStations = async () => {
    try {
      setLoading(true);
      const topStations = await fetchTopStations(100);
      setStations(topStations);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load top stations. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = async (country: string) => {
    try {
      setSelectedCountry(country);
      setLoading(true);
      setIsStationsPanelExpanded(true);
      
      const countryStations = await fetchStationsByCountry(country);
      setStations(countryStations);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load stations for ${country}. Please try again later.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-background">
      <WorldMap
        selectedCountry={selectedCountry}
        onSelectCountry={handleCountrySelect}
      />
      
      <div className="relative z-10">
        {/* Available Stations - Left Side */}
        <CollapsiblePanel 
          title="Available Stations" 
          side="left"
          isExpanded={isStationsPanelExpanded}
          onExpandedChange={setIsStationsPanelExpanded}
        >
          <StationList
            stations={stations}
            onSelectStation={setSelectedStation}
            loading={loading}
          />
        </CollapsiblePanel>

        {/* Favorite Stations - Right Side */}
        <CollapsiblePanel title="Favorite Stations" side="right">
          <FavoriteStations onSelectStation={setSelectedStation} />
        </CollapsiblePanel>

        <RadioPlayer station={selectedStation} />
      </div>
    </main>
  );
}