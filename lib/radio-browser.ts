const API_BASE_URL = "https://de1.api.radio-browser.info/json";

export async function fetchStationsByCountry(country: string) {
  const response = await fetch(
    `${API_BASE_URL}/stations/bycountry/${encodeURIComponent(country)}?hidebroken=true&limit=100&order=clickcount`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stations");
  }
  const stations = await response.json();
  
  // Filter stations to ensure they are actually from the selected country
  return stations.filter((station: any) => 
    station.country && 
    station.country.toLowerCase() === country.toLowerCase() &&
    station.countrycode // Ensure the station has a valid country code
  );
}

export async function fetchTopStations(limit: number = 100) {
  const response = await fetch(
    `${API_BASE_URL}/stations/topclick/${limit}?hidebroken=true`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch top stations");
  }
  return response.json();
}

export async function fetchStationsByTag(tag: string) {
  const response = await fetch(
    `${API_BASE_URL}/stations/bytag/${encodeURIComponent(tag)}?hidebroken=true&limit=100&order=clickcount`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stations by tag");
  }
  return response.json();
}

export async function fetchCountries() {
  const response = await fetch(`${API_BASE_URL}/countries`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  const data = await response.json();
  return data
    .filter((country: any) => country.name && country.stationcount > 0)
    .map((country: any) => country.name)
    .sort();
}

export async function fetchTags() {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  const data = await response.json();
  return data
    .filter((tag: any) => tag.name && tag.stationcount > 0)
    .map((tag: any) => ({ name: tag.name, stationcount: tag.stationcount }))
    .sort((a: any, b: any) => b.stationcount - a.stationcount)
    .map((tag: any) => tag.name);
}

export async function fetchCountryStats(country: string) {
  const response = await fetch(
    `${API_BASE_URL}/stations/bycountry/${encodeURIComponent(country)}?hidebroken=true&limit=5&order=clickcount`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch country stats");
  }
  const stations = await response.json();
  
  // Get unique tags from the stations
  const tags = new Set<string>();
  stations.forEach((station: any) => {
    if (station.tags) {
      station.tags.split(',').forEach((tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) tags.add(trimmedTag);
      });
    }
  });

  return {
    topStations: stations.slice(0, 3).map((s: any) => ({
      name: s.name,
      favicon: s.favicon,
    })),
    popularTags: Array.from(tags).slice(0, 3)
  };
}