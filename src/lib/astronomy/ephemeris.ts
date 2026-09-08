import * as Astronomy from 'astronomy-engine';
import { PlanetId, PlanetPosition } from '../types/astrology';
import { PLANET_METADATA } from './constants';
import {
  normalize360,
  getZodiacSign,
  getSignDegree,
  formatDegree,
  toRadians,
  toDegrees,
} from './coordinates';

/**
 * Calcula la longitud del Nodo Lunar (Nodo Norte verdadero/medio) según la teoría de Brown/Meeus
 */
function calculateLunarNodeLongitude(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525; // Siglos julianos desde J2000.0

  // Longitud media del nodo ascendente
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;

  // Corrección periódica principal (Sol) para el nodo verdadero
  const sunMeanLong = 280.4665 + 36000.7698 * T;
  const moonMeanLong = 218.3165 + 481267.8813 * T;
  const dOmega =
    -0.25 * Math.sin(toRadians(2 * (sunMeanLong - omega))) -
    0.17 * Math.sin(toRadians(2 * moonMeanLong));

  return normalize360(omega + dOmega);
}

/**
 * Calcula la posición aproximada de Quirón (2060 Chiron)
 * usando sus elementos orbitales heliocéntricos y conversión geocéntrica
 */
function calculateChironLongitude(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525;
  // Movimiento medio n = 0.0194° / día
  // Longitud media de Chiron en J2000 = ~268.5°
  const d = julianDay - 2451545.0;
  const meanAnomaly = normalize360(268.5 + 0.01941 * d);

  // Ecuación del centro para excentricidad e = 0.383
  const e = 0.383;
  const equationOfCenter =
    toDegrees(2 * e * Math.sin(toRadians(meanAnomaly)) + 1.25 * e * e * Math.sin(toRadians(2 * meanAnomaly)));

  const trueLongitude = normalize360(meanAnomaly + equationOfCenter);
  return trueLongitude;
}

/**
 * Obtiene la longitud eclíptica geocéntrica de un cuerpo celeste en una fecha dada
 */
function getEclipticLongitude(planetId: PlanetId, date: Date, julianDay: number): { longitude: number; latitude: number } {
  switch (planetId) {
    case 'sun': {
      const sunPos = Astronomy.SunPosition(date);
      return { longitude: sunPos.elon, latitude: sunPos.elat };
    }
    case 'moon': {
      const moonPos = Astronomy.EclipticGeoMoon(date);
      return { longitude: moonPos.lon, latitude: moonPos.lat };
    }
    case 'mercury': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Mercury, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'venus': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Venus, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'mars': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Mars, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'jupiter': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Jupiter, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'saturn': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Saturn, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'uranus': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Uranus, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'neptune': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Neptune, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'pluto': {
      const vec = Astronomy.GeoVector(Astronomy.Body.Pluto, date, true);
      const ecl = Astronomy.Ecliptic(vec);
      return { longitude: ecl.elon, latitude: ecl.elat };
    }
    case 'north_node': {
      const nodeLon = calculateLunarNodeLongitude(julianDay);
      return { longitude: nodeLon, latitude: 0 };
    }
    case 'south_node': {
      const northNodeLon = calculateLunarNodeLongitude(julianDay);
      return { longitude: normalize360(northNodeLon + 180), latitude: 0 };
    }
    case 'chiron': {
      const chironLon = calculateChironLongitude(julianDay);
      return { longitude: chironLon, latitude: 0 };
    }
    default:
      throw new Error(`Planeta desconocido: ${planetId}`);
  }
}

/**
 * Calcula la velocidad angular y determina si el planeta se encuentra en retrogradación
 */
function calculateSpeedAndRetrograde(
  planetId: PlanetId,
  date: Date,
  julianDay: number
): { speed: number; isRetrograde: boolean } {
  // Para los nodos lunares, el movimiento medio es siempre retrógrado (-0.053°/día)
  if (planetId === 'north_node' || planetId === 'south_node') {
    return { speed: -0.053, isRetrograde: true };
  }

  const dtHours = 1; // 1 hora de diferencia para evaluar derivada
  const ms = dtHours * 3600 * 1000;

  const dateBefore = new Date(date.getTime() - ms);
  const dateAfter = new Date(date.getTime() + ms);

  const posBefore = getEclipticLongitude(planetId, dateBefore, julianDay - dtHours / 24);
  const posAfter = getEclipticLongitude(planetId, dateAfter, julianDay + dtHours / 24);

  // Calcular diferencia angular considerando cruce de 0°/360°
  let diff = posAfter.longitude - posBefore.longitude;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  // Velocidad diaria en grados/día
  const speed = (diff / (2 * dtHours)) * 24;
  const isRetrograde = speed < 0;

  return { speed, isRetrograde };
}

/**
 * Calcula todas las posiciones planetarias y puntos importantes para una fecha UTC y día juliano dados
 */
export function calculatePlanetaryPositions(
  utcDateString: string,
  julianDay: number
): PlanetPosition[] {
  const date = new Date(utcDateString);
  const planetIds: PlanetId[] = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'north_node',
    'south_node',
    'chiron',
  ];

  return planetIds.map((id) => {
    const meta = PLANET_METADATA[id];
    const { longitude, latitude } = getEclipticLongitude(id, date, julianDay);
    const { speed, isRetrograde } = calculateSpeedAndRetrograde(id, date, julianDay);

    const normLong = normalize360(longitude);
    const signInfo = getZodiacSign(normLong);
    const signDegree = getSignDegree(normLong);
    const degreeFormatted = formatDegree(signDegree);

    return {
      id,
      name: meta.nameEs,
      symbol: meta.symbol,
      longitude: normLong,
      latitude,
      speed,
      isRetrograde,
      sign: signInfo.name,
      signDegree,
      degreeFormatted,
      house: 1, // Se asignará en el módulo de casas
    };
  });
}
