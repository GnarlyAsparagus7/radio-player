"use client";

import { memo, useEffect, useState } from "react";
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
  const [markerOpacity, setMarkerOpacity] = useState(0.6);

  useEffect(() => {
    let scaleInterval: NodeJS.Timeout;
    let opacityInterval: NodeJS.Timeout;

    if (selectedCountry) {
      // Pulse animation for size
      scaleInterval = setInterval(() => {
        setMarkerScale((scale) => (scale === 1 ? 1.5 : 1));
      }, 1000);

      // Fade animation for opacity
      opacityInterval = setInterval(() => {
        setMarkerOpacity((opacity) => (opacity === 0.6 ? 0.3 : 0.6));
      }, 500);
    }

    return () => {
      if (scaleInterval) clearInterval(scaleInterval);
      if (opacityInterval) clearInterval(opacityInterval);
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
                <g>
                  {/* Outer glow effect */}
                  <circle
                    r={8 * markerScale}
                    fill="hsl(var(--primary))"
                    fillOpacity={markerOpacity * 0.3}
                    style={{
                      transition: "all 0.5s ease-in-out",
                    }}
                  />
                  {/* Main circle */}
                  <circle
                    r={4 * markerScale}
                    fill="hsl(var(--primary))"
                    fillOpacity={markerOpacity}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    style={{
                      transition: "all 0.5s ease-in-out",
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