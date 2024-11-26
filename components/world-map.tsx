"use client";

import { memo, useEffect, useState, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { countryCoordinates } from "@/lib/coordinates";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  selectedCountry: string | null;
  onSelectCountry: (countryCode: string) => void;
}

const WorldMap = memo(({ selectedCountry, onSelectCountry }: WorldMapProps) => {
  const [markerScale, setMarkerScale] = useState(1);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

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
                    <Geography
                      key={geo.rsmKey}
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
                          transition: "all 0.3s ease-in-out",
                          animation: selectedCountry === countryName
                            ? "pulse 2s infinite"
                            : "none",
                        },
                        hover: {
                          fill: "hsl(var(--primary))",
                          stroke: "hsl(var(--border))",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill: "hsl(var(--primary))",
                          stroke: "hsl(var(--border))",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
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