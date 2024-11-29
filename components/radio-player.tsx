"use client";

import { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause, Heart, Radio } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addToFavorites, removeFromFavorites, isStationFavorite } from "@/lib/favorites";
import { cn, debounce } from "@/lib/utils";

interface RadioPlayerProps {
  station: {
    name: string;
    url: string;
    favicon: string;
    tags?: string;
  } | null;
}

export function RadioPlayer({ station }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Check if station is favorite when it changes
  useEffect(() => {
    if (station) {
      setIsFavorite(isStationFavorite(station.url));
    }
  }, [station]);

  // Optimize audio element with lazy loading and cleanup
  useEffect(() => {
    if (station) {
      // Create audio element only when needed
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = "none"; // Don't preload audio until play
      }
      
      // Configure audio element
      audioRef.current.src = station.url;
      
      // Auto-play when station changes
      const playNewStation = async () => {
        try {
          audioRef.current!.preload = "auto";
          const playPromise = audioRef.current!.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
            setIsLoaded(true);
            toast({
              title: "Now Playing",
              description: `${station.name}`,
            });
          }
        } catch (error) {
          console.error("Playback error:", error);
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Unable to play this station. Please try another one.",
          });
          setIsPlaying(false);
        }
      };
      
      playNewStation();
      
      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          setIsPlaying(false);
          setIsLoaded(false);
        }
      };
    }
  }, [station, toast]);

  // Separate effect for volume and mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Optimize play/pause with proper resource management
  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !station) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Set preload to auto only when attempting to play
        audioRef.current.preload = "auto";
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setIsLoaded(true);
          toast({
            title: "Now Playing",
            description: `${station.name}`,
          });
        }
      }
    } catch (error) {
      console.error("Playback error:", error);
      toast({
        variant: "destructive",
        title: "Playback Error",
        description: "Unable to play this station. Please try another one.",
      });
      setIsPlaying(false);
    }
  }, [station, isPlaying, toast]);

  // Optimize image loading with lazy loading and error handling
  const StationImage = memo(({ favicon, name }: { favicon: string; name: string }) => {
    const [imgError, setImgError] = useState(false);

    if (!favicon || imgError) {
      return (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
          <Radio className="h-6 w-6 text-muted-foreground" />
        </div>
      );
    }

    return (
      <img
        src={favicon}
        alt={name}
        className="w-12 h-12 rounded-lg object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  });

  StationImage.displayName = "StationImage";

  // Optimize volume control with debouncing
  const debouncedVolumeChange = useMemo(
    () => debounce((value: number[]) => {
      if (audioRef.current) {
        audioRef.current.volume = value[0] / 100;
      }
    }, 100),
    []
  );

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value);
    debouncedVolumeChange(value);
  }, [debouncedVolumeChange]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFavorite = () => {
    if (!station) return;

    if (isFavorite) {
      removeFromFavorites(station.url);
      toast({
        title: "Removed from Favorites",
        description: `${station.name} has been removed from your favorites`,
      });
    } else {
      addToFavorites(station);
      toast({
        title: "Added to Favorites",
        description: `${station.name} has been added to your favorites`,
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleError = () => {
    setIsPlaying(false);
    toast({
      variant: "destructive",
      title: "Stream Error",
      description: "Unable to load the radio stream. Please try another station.",
    });
  };

  if (!station) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t">
      <audio
        ref={audioRef}
        src={station.url}
        onError={handleError}
      />
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {station.favicon && (
            <StationImage favicon={station.favicon} name={station.name} />
          )}

          <div>
            <h3 className="font-semibold">{station.name}</h3>
            <p className="text-sm text-muted-foreground">{station.tags}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-12 w-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              max={100}
              min={0}
              value={volume}
              onValueChange={handleVolumeChange}
              className="w-24"
              aria-label="Volume"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={cn("h-8 w-8", isFavorite && "text-red-500")}
            >
              <Heart
                className={cn("h-4 w-4", isFavorite && "fill-current")}
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}