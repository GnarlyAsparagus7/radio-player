"use client";

import { memo, useEffect, useState, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { useQuery } from "@tanstack/react-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { countryCoordinates } from "@/lib/coordinates";
import { fetchCountryStats } from "@/lib/radio-browser";
import { Radio } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  selectedCountry: string | null;
  onSelectCountry: (countryCode: string) => void;
}

const CountryPreview = ({ countryName }: { countryName: string }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['countryStats', countryName],
    queryFn: () => fetchCountryStats(countryName),
    enabled: !!countryName,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!stats?.topStations.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {stats.popularTags.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">Popular Genres:</p>
          <div className="flex flex-wrap gap-1">
            {stats.popularTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <p className="text-xs font-medium text-foreground">Top Stations:</p>
        <div className="space-y-2">
          {stats.topStations.map((station) => (
            <div key={station.name} className="flex items-center gap-2">
              {station.favicon ? (
                <img
                  src={station.favicon}
                  alt={station.name}
                  className="w-4 h-4 rounded-sm object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Radio className="w-4 h-4 text-foreground" />
              )}
              <span className="text-xs truncate text-foreground">{station.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorldMap = memo(({ selectedCountry, onSelectCountry }: WorldMapProps) => {
  const [markerScale, setMarkerScale] = useState(1);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const { data: stationCounts } = useQuery({
    queryKey: ["stationCounts"],
    queryFn: async () => {
      const response = await fetch(
        "https://de1.api.radio-browser.info/json/stations/countrycodes"
      );
      const data = await response.json();
      return data.reduce((acc: Record<string, number>, item: any) => {
        acc[item.name] = item.stationcount;
        return acc;
      }, {});
    },
  });

  useEffect(() => {
    if (!selectedCountry) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setMarkerScale(1);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = (elapsed % 3000) / 3000; // 3 seconds per cycle
      
      // Smooth sine wave animation
      const scale = 1 + 0.3 * Math.sin(progress * Math.PI * 2);
      setMarkerScale(scale);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedCountry]);

  return (
    <div className="fixed inset-0 w-full h-full bg-background">
      <div className="absolute inset-0 opacity-60 hover:opacity-80 transition-opacity duration-300">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 150,
          }}
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "transparent",
          }}
        >
          <ZoomableGroup center={[0, 30]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  return (
                    <HoverCard key={geo.rsmKey} openDelay={0} closeDelay={0}>
                      <HoverCardTrigger asChild>
                        <Geography
                          geography={geo}
                          onClick={() => {
                            onSelectCountry(countryName);
                          }}
                          style={{
                            default: {
                              fill: selectedCountry === countryName
                                ? "hsl(var(--primary))"
                                : "hsl(var(--muted-foreground))",
                              stroke: "hsl(var(--border))",
                              strokeWidth: 0.5,
                              outline: "none",
                              transition: "all 0.3s ease-in-out"
                            },
                            hover: {
                              fill: "hsl(var(--primary))",
                              stroke: "hsl(var(--border))",
                              strokeWidth: 0.5,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: "hsl(var(--primary))",
                              stroke: "hsl(var(--border))",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                          }}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent 
                        side="top" 
                        align="center"
                        sideOffset={5}
                        className="z-[1000] w-64 bg-background/95 backdrop-blur border shadow-lg"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="space-y-1">
                            <h4 className="font-medium text-lg text-foreground">{countryName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {stationCounts?.[countryName] ?? 0} stations available
                            </p>
                          </div>
                          
                          <CountryPreview countryName={countryName} />
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })
              }
            </Geographies>
            {selectedCountry && countryCoordinates[selectedCountry] && (
              <Marker coordinates={countryCoordinates[selectedCountry]}>
                <defs>
                  {/* Gradient for outer glow */}
                  <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
                  </radialGradient>
                  {/* Gradient for middle circle */}
                  <radialGradient id="middleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#FFE66D" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.2" />
                  </radialGradient>
                </defs>
                <g>
                  {/* Outer glow effect */}
                  <circle
                    r={10 * markerScale}
                    fill="url(#outerGlow)"
                  />
                  {/* Secondary circle */}
                  <circle
                    r={6 * markerScale}
                    fill="url(#middleGlow)"
                  />
                  {/* Main circle */}
                  <circle
                    r={3}
                    fill="#FF6B6B"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    style={{
                      filter: "drop-shadow(0 0 3px #FF6B6B)",
                    }}
                  />
                </g>
              </Marker>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
});

WorldMap.displayName = "WorldMap";

export default WorldMap;