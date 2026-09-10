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
 * Base de datos offline de ciudades principales para búsqueda instantánea en 0ms y fallback.
 */
export const POPULAR_CITIES: GeocodedPlace[] = [
  // Perú
  { name: 'Lima', city: 'Lima', country: 'Perú', latitude: -12.0464, longitude: -77.0428, timezoneIana: 'America/Lima', formattedAddress: 'Lima, Perú' },
  { name: 'Trujillo', city: 'Trujillo', state: 'La Libertad', country: 'Perú', latitude: -8.1116, longitude: -79.0286, timezoneIana: 'America/Lima', formattedAddress: 'Trujillo, La Libertad, Perú' },
  { name: 'Arequipa', city: 'Arequipa', country: 'Perú', latitude: -16.4090, longitude: -71.5375, timezoneIana: 'America/Lima', formattedAddress: 'Arequipa, Perú' },
  { name: 'Cusco', city: 'Cusco', country: 'Perú', latitude: -13.5319, longitude: -71.9675, timezoneIana: 'America/Lima', formattedAddress: 'Cusco, Perú' },
  { name: 'Chiclayo', city: 'Chiclayo', country: 'Perú', latitude: -6.7714, longitude: -79.8409, timezoneIana: 'America/Lima', formattedAddress: 'Chiclayo, Perú' },
  { name: 'Piura', city: 'Piura', country: 'Perú', latitude: -5.1945, longitude: -80.6328, timezoneIana: 'America/Lima', formattedAddress: 'Piura, Perú' },
  { name: 'Huancayo', city: 'Huancayo', country: 'Perú', latitude: -12.0651, longitude: -75.2049, timezoneIana: 'America/Lima', formattedAddress: 'Huancayo, Perú' },
  { name: 'Iquitos', city: 'Iquitos', country: 'Perú', latitude: -3.7491, longitude: -73.2538, timezoneIana: 'America/Lima', formattedAddress: 'Iquitos, Perú' },
  // España
  { name: 'Madrid', city: 'Madrid', country: 'España', latitude: 40.4168, longitude: -3.7038, timezoneIana: 'Europe/Madrid', formattedAddress: 'Madrid, España' },
  { name: 'Barcelona', city: 'Barcelona', country: 'España', latitude: 41.3874, longitude: 2.1686, timezoneIana: 'Europe/Madrid', formattedAddress: 'Barcelona, España' },
  { name: 'Valencia', city: 'Valencia', country: 'España', latitude: 39.4699, longitude: -0.3763, timezoneIana: 'Europe/Madrid', formattedAddress: 'Valencia, España' },
  { name: 'Sevilla', city: 'Sevilla', country: 'España', latitude: 37.3891, longitude: -5.9845, timezoneIana: 'Europe/Madrid', formattedAddress: 'Sevilla, España' },
  { name: 'Málaga', city: 'Málaga', country: 'España', latitude: 36.7213, longitude: -4.4214, timezoneIana: 'Europe/Madrid', formattedAddress: 'Málaga, España' },
  { name: 'Bilbao', city: 'Bilbao', country: 'España', latitude: 43.2630, longitude: -2.9350, timezoneIana: 'Europe/Madrid', formattedAddress: 'Bilbao, España' },
  // México
  { name: 'Ciudad de México', city: 'Ciudad de México', country: 'México', latitude: 19.4326, longitude: -99.1332, timezoneIana: 'America/Mexico_City', formattedAddress: 'Ciudad de México, México' },
  { name: 'Guadalajara', city: 'Guadalajara', country: 'México', latitude: 20.6597, longitude: -103.3496, timezoneIana: 'America/Mexico_City', formattedAddress: 'Guadalajara, México' },
  { name: 'Monterrey', city: 'Monterrey', country: 'México', latitude: 25.6866, longitude: -100.3161, timezoneIana: 'America/Monterrey', formattedAddress: 'Monterrey, México' },
  { name: 'Cancún', city: 'Cancún', country: 'México', latitude: 21.1619, longitude: -86.8515, timezoneIana: 'America/Cancun', formattedAddress: 'Cancún, México' },
  // Argentina
  { name: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816, timezoneIana: 'America/Argentina/Buenos_Aires', formattedAddress: 'Buenos Aires, Argentina' },
  { name: 'Córdoba', city: 'Córdoba', country: 'Argentina', latitude: -31.4201, longitude: -64.1888, timezoneIana: 'America/Argentina/Cordoba', formattedAddress: 'Córdoba, Argentina' },
  { name: 'Rosario', city: 'Rosario', country: 'Argentina', latitude: -32.9468, longitude: -60.6393, timezoneIana: 'America/Argentina/Cordoba', formattedAddress: 'Rosario, Argentina' },
  { name: 'Mendoza', city: 'Mendoza', country: 'Argentina', latitude: -32.8895, longitude: -68.8458, timezoneIana: 'America/Argentina/Mendoza', formattedAddress: 'Mendoza, Argentina' },
  // Colombia
  { name: 'Bogotá', city: 'Bogotá', country: 'Colombia', latitude: 4.7110, longitude: -74.0721, timezoneIana: 'America/Bogota', formattedAddress: 'Bogotá, Colombia' },
  { name: 'Medellín', city: 'Medellín', country: 'Colombia', latitude: 6.2442, longitude: -75.5812, timezoneIana: 'America/Bogota', formattedAddress: 'Medellín, Colombia' },
  { name: 'Cali', city: 'Cali', country: 'Colombia', latitude: 3.4516, longitude: -76.5320, timezoneIana: 'America/Bogota', formattedAddress: 'Cali, Colombia' },
  { name: 'Barranquilla', city: 'Barranquilla', country: 'Colombia', latitude: 10.9685, longitude: -74.7813, timezoneIana: 'America/Bogota', formattedAddress: 'Barranquilla, Colombia' },
  // Chile
  { name: 'Santiago', city: 'Santiago', country: 'Chile', latitude: -33.4489, longitude: -70.6693, timezoneIana: 'America/Santiago', formattedAddress: 'Santiago, Chile' },
  { name: 'Valparaíso', city: 'Valparaíso', country: 'Chile', latitude: -33.0472, longitude: -71.6127, timezoneIana: 'America/Santiago', formattedAddress: 'Valparaíso, Chile' },
  // Otros países
  { name: 'Caracas', city: 'Caracas', country: 'Venezuela', latitude: 10.4806, longitude: -66.9036, timezoneIana: 'America/Caracas', formattedAddress: 'Caracas, Venezuela' },
  { name: 'Quito', city: 'Quito', country: 'Ecuador', latitude: -0.1807, longitude: -78.4678, timezoneIana: 'America/Guayaquil', formattedAddress: 'Quito, Ecuador' },
  { name: 'Guayaquil', city: 'Guayaquil', country: 'Ecuador', latitude: -2.1894, longitude: -79.8891, timezoneIana: 'America/Guayaquil', formattedAddress: 'Guayaquil, Ecuador' },
  { name: 'La Paz', city: 'La Paz', country: 'Bolivia', latitude: -16.4897, longitude: -68.1193, timezoneIana: 'America/La_Paz', formattedAddress: 'La Paz, Bolivia' },
  { name: 'Montevideo', city: 'Montevideo', country: 'Uruguay', latitude: -34.9011, longitude: -56.1645, timezoneIana: 'America/Montevideo', formattedAddress: 'Montevideo, Uruguay' },
  { name: 'Asunción', city: 'Asunción', country: 'Paraguay', latitude: -25.2637, longitude: -57.5759, timezoneIana: 'America/Asuncion', formattedAddress: 'Asunción, Paraguay' },
  { name: 'San José', city: 'San José', country: 'Costa Rica', latitude: 9.9281, longitude: -84.0907, timezoneIana: 'America/Costa_Rica', formattedAddress: 'San José, Costa Rica' },
  { name: 'Panamá', city: 'Ciudad de Panamá', country: 'Panamá', latitude: 8.9824, longitude: -79.5199, timezoneIana: 'America/Panama', formattedAddress: 'Ciudad de Panamá, Panamá' },
  { name: 'Miami', city: 'Miami', country: 'Estados Unidos', latitude: 25.7617, longitude: -80.1918, timezoneIana: 'America/New_York', formattedAddress: 'Miami, Florida, Estados Unidos' },
  { name: 'Nueva York', city: 'New York', country: 'Estados Unidos', latitude: 40.7128, longitude: -74.0060, timezoneIana: 'America/New_York', formattedAddress: 'New York, Estados Unidos' },
  { name: 'París', city: 'París', country: 'Francia', latitude: 48.8566, longitude: 2.3522, timezoneIana: 'Europe/Paris', formattedAddress: 'París, Francia' },
  { name: 'Roma', city: 'Roma', country: 'Italia', latitude: 41.9028, longitude: 12.4964, timezoneIana: 'Europe/Rome', formattedAddress: 'Roma, Italia' },
  { name: 'Londres', city: 'Londres', country: 'Reino Unido', latitude: 51.5074, longitude: -0.1278, timezoneIana: 'Europe/London', formattedAddress: 'Londres, Reino Unido' },
];

/**
 * Busca lugares y ciudades en el mundo con autocompletado de alta precisión
 * usando Photon (OpenStreetMap) sin parámetros no soportados, con respaldo offline instantáneo.
 */
export async function searchPlaces(query: string): Promise<GeocodedPlace[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

  // 1. Filtrar primero coincidencias instantáneas de la lista offline
  const offlineMatches = POPULAR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(cleanQuery) ||
      c.formattedAddress.toLowerCase().includes(cleanQuery) ||
      c.country.toLowerCase().includes(cleanQuery)
  );

  // 2. Consultar Photon API (sin lang=es que causaba error 400)
  const encoded = encodeURIComponent(cleanQuery);
  const url = `https://photon.komoot.io/api/?q=${encoded}&limit=8`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AstralSynastryApp/1.0',
      },
    });

    if (!res.ok) {
      console.warn(`Photon HTTP ${res.status}, usando ciudades offline`);
      return offlineMatches;
    }

    const data = await res.json();
    if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
      return offlineMatches;
    }

    const remotePlaces: GeocodedPlace[] = data.features.map((feat: any) => {
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

    // Combinar sin duplicados
    const combined = [...offlineMatches];
    for (const r of remotePlaces) {
      if (!combined.some((c) => Math.abs(c.latitude - r.latitude) < 0.05 && Math.abs(c.longitude - r.longitude) < 0.05)) {
        combined.push(r);
      }
    }

    return combined.slice(0, 8);
  } catch (error) {
    console.warn('Error in searchPlaces, fallback to offline:', error);
    return offlineMatches;
  }
}

/**
 * Resuelve automáticamente una ciudad a sus coordenadas y zona IANA.
 */
export async function resolveLocation(query: string): Promise<GeocodedPlace | null> {
  if (!query || query.trim().length < 2) return null;
  const results = await searchPlaces(query);
  return results.length > 0 ? results[0] : null;
}

