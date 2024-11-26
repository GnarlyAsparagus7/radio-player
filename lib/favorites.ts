import { Station } from "./types";

const FAVORITES_KEY = "radio-favorites";
const FAVORITES_UPDATED_EVENT = "favoritesUpdated";

export function getFavorites(): Station[] {
  if (typeof window === "undefined") return [];
  
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
}

export function addToFavorites(station: Station) {
  const favorites = getFavorites();
  const isAlreadyFavorite = favorites.some((fav) => fav.url === station.url);
  
  if (!isAlreadyFavorite) {
    favorites.push(station);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    // Dispatch custom event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
    }
  }
}

export function removeFromFavorites(stationUrl: string) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((fav) => fav.url !== stationUrl);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  // Dispatch custom event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
  }
}

export function isStationFavorite(stationUrl: string): boolean {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.url === stationUrl);
}

export { FAVORITES_UPDATED_EVENT };
