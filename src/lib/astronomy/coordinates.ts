import { ZodiacSignInfo, ZodiacSignName } from '../types/astrology';
import { ZODIAC_SIGNS } from './constants';

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normaliza un ángulo al rango [0, 360)
 */
export function normalize360(degrees: number): number {
  const mod = degrees % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Calcula la distancia angular mínima entre dos longitudes en el círculo de 360° (rango 0° a 180°)
 */
export function angularDistance(deg1: number, deg2: number): number {
  const diff = Math.abs(normalize360(deg1) - normalize360(deg2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Retorna el signo zodiacal correspondiente a una longitud eclíptica (0 - 360)
 */
export function getZodiacSign(longitude: number): ZodiacSignInfo {
  const norm = normalize360(longitude);
  const signIndex = Math.floor(norm / 30) % 12;
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Retorna el grado dentro del signo (0 - 29.999...)
 */
export function getSignDegree(longitude: number): number {
  return normalize360(longitude) % 30;
}

/**
 * Formatea un grado decimal a string sexagesimal: ej. 14° 23' 45"
 */
export function formatDegree(degreeInSign: number): string {
  const deg = Math.floor(degreeInSign);
  const minFloat = (degreeInSign - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);

  // Manejar redondeo a 60 segundos
  if (sec === 60) {
    return `${deg}° ${(min + 1).toString().padStart(2, '0')}' 00"`;
  }
  return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toString().padStart(2, '0')}"`;
}
