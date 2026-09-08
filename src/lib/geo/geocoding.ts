import { lookupTimezone } from './timezone';

export interface GeocodedPlace {
  name: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneIana: string;
  formattedAddress: string;
}

/**
 * Busca lugares y ciudades en el mundo con autocompletado de alta precisión
 * usando Photon (OpenStreetMap) con soporte para fallbacks.
 */
export async function searchPlaces(query: string): Promise<GeocodedPlace[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim();
  const encoded = encodeURIComponent(cleanQuery);
  const url = `https://photon.komoot.io/api/?q=${encoded}&limit=6&lang=es`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AstralSynastryApp/1.0',
      },
    });

    if (!res.ok) {
      throw new Error(`Photon geocoding error: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    const places: GeocodedPlace[] = data.features.map((feat: any) => {
      const props = feat.properties || {};
      const [lng, lat] = feat.geometry?.coordinates || [0, 0];

      const cityName = props.city || props.name || props.county || 'Desconocido';
      const state = props.state;
      const country = props.country || '';

      const addressParts = [cityName];
      if (state && state !== cityName) addressParts.push(state);
      if (country) addressParts.push(country);
      const formattedAddress = addressParts.join(', ');

      const timezoneIana = lookupTimezone(lat, lng);

      return {
        name: props.name || cityName,
        city: cityName,
        state,
        country,
        latitude: lat,
        longitude: lng,
        timezoneIana,
        formattedAddress,
      };
    });

    // Filtrar duplicados con coordenadas idénticas
    const seen = new Set<string>();
    return places.filter((p) => {
      const key = `${p.latitude.toFixed(3)}_${p.longitude.toFixed(3)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (error) {
    console.error('Error in searchPlaces:', error);
    return [];
  }
}
