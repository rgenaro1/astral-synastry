import * as Astronomy from 'astronomy-engine';
import {
  AnglePoint,
  HouseCusp,
  HouseSystem,
  PlanetPosition,
} from '../types/astrology';
import {
  normalize360,
  getZodiacSign,
  getSignDegree,
  formatDegree,
  toRadians,
  toDegrees,
} from './coordinates';

/**
 * Calcula la oblicuidad verdadera de la eclíptica (eps) en grados para una fecha dada
 */
export function getObliquity(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525;
  // IAU 2000 formula aproximada
  return 23.4392911 - 0.0130042 * T - 0.00000016 * T * T;
}

/**
 * Calcula el Tiempo Sideral Local (RAMC) en grados [0, 360)
 */
export function calculateRAMC(date: Date, longitude: number): number {
  const gstHours = Astronomy.SiderealTime(date); // en horas [0, 24)
  const gstDegrees = gstHours * 15;
  return normalize360(gstDegrees + longitude);
}

/**
 * Calcula la cúspide del Medio Cielo (MC) en grados [0, 360)
 */
export function calculateMidheaven(ramcDeg: number, epsDeg: number): number {
  const ramcRad = toRadians(ramcDeg);
  const epsRad = toRadians(epsDeg);
  const y = Math.sin(ramcRad);
  const x = Math.cos(ramcRad) * Math.cos(epsRad);
  return normalize360(toDegrees(Math.atan2(y, x)));
}

/**
 * Calcula la cúspide del Ascendente (ASC) en grados [0, 360)
 */
export function calculateAscendant(
  ramcDeg: number,
  latitudeDeg: number,
  epsDeg: number
): number {
  const ramcRad = toRadians(ramcDeg);
  const latRad = toRadians(latitudeDeg);
  const epsRad = toRadians(epsDeg);

  const y = Math.cos(ramcRad);
  const x =
    -Math.sin(ramcRad) * Math.cos(epsRad) -
    Math.tan(latRad) * Math.sin(epsRad);

  return normalize360(toDegrees(Math.atan2(y, x)));
}

/**
 * Calcula los 4 ángulos cardinales principales
 */
export function calculateAngles(
  date: Date,
  latitude: number,
  longitude: number,
  julianDay: number
): {
  ascendant: AnglePoint;
  midheaven: AnglePoint;
  descendant: AnglePoint;
  imumCoeli: AnglePoint;
  ramc: number;
  eps: number;
} {
  const eps = getObliquity(julianDay);
  const ramc = calculateRAMC(date, longitude);

  const mcLon = calculateMidheaven(ramc, eps);
  const ascLon = calculateAscendant(ramc, latitude, eps);
  const icLon = normalize360(mcLon + 180);
  const dscLon = normalize360(ascLon + 180);

  const createAngle = (id: AnglePoint['id'], name: string, symbol: string, lon: number): AnglePoint => {
    const signInfo = getZodiacSign(lon);
    const signDeg = getSignDegree(lon);
    return {
      id,
      name,
      symbol,
      longitude: lon,
      sign: signInfo.name,
      signDegree: signDeg,
      degreeFormatted: formatDegree(signDeg),
    };
  };

  return {
    ascendant: createAngle('ascendant', 'Ascendente', 'AC', ascLon),
    midheaven: createAngle('midheaven', 'Medio Cielo', 'MC', mcLon),
    descendant: createAngle('descendant', 'Descendente', 'DC', dscLon),
    imumCoeli: createAngle('imum_coeli', 'Fondo del Cielo', 'IC', icLon),
    ramc,
    eps,
  };
}

/**
 * Calcula las 12 cúspides según el sistema de casas solicitado (Placidus, Whole Sign o Equal)
 */
export function calculateHouses(
  houseSystem: HouseSystem,
  ramc: number,
  latitude: number,
  eps: number,
  ascendantLon: number,
  midheavenLon: number
): HouseCusp[] {
  const cuspsDeg: number[] = new Array(12);

  if (houseSystem === 'whole-sign') {
    // Casas Enteras: La casa 1 comienza a 0° del signo del Ascendente
    const ascSign = Math.floor(ascendantLon / 30);
    for (let i = 0; i < 12; i++) {
      cuspsDeg[i] = normalize360((ascSign + i) * 30);
    }
  } else if (houseSystem === 'equal') {
    // Casas Iguales: Cúspide 1 es el grado exacto del Ascendente, cada casa tiene 30°
    for (let i = 0; i < 12; i++) {
      cuspsDeg[i] = normalize360(ascendantLon + i * 30);
    }
  } else {
    // Placidus por defecto
    // Si la latitud es muy extrema (|lat| >= 66°), Placidus no intersecta la esfera, se usa Whole Sign
    if (Math.abs(latitude) >= 66) {
      return calculateHouses('whole-sign', ramc, latitude, eps, ascendantLon, midheavenLon);
    }

    cuspsDeg[0] = ascendantLon; // Casa 1
    cuspsDeg[6] = normalize360(ascendantLon + 180); // Casa 7
    cuspsDeg[9] = midheavenLon; // Casa 10
    cuspsDeg[3] = normalize360(midheavenLon + 180); // Casa 4

    // Trisección de semiarcos diurnos y nocturnos
    const f1 = toDegrees(Math.asin(Math.sin(toRadians(latitude)) / 3));
    const f2 = toDegrees(Math.asin((2 * Math.sin(toRadians(latitude))) / 3));

    cuspsDeg[10] = calculateAscendant(normalize360(ramc + 30), f1, eps); // Casa 11
    cuspsDeg[11] = calculateAscendant(normalize360(ramc + 60), f2, eps); // Casa 12
    cuspsDeg[1] = calculateAscendant(normalize360(ramc + 120), f2, eps); // Casa 2
    cuspsDeg[2] = calculateAscendant(normalize360(ramc + 150), f1, eps); // Casa 3

    // Cúspides opuestas (180°)
    cuspsDeg[4] = normalize360(cuspsDeg[10] + 180); // Casa 5
    cuspsDeg[5] = normalize360(cuspsDeg[11] + 180); // Casa 6
    cuspsDeg[7] = normalize360(cuspsDeg[1] + 180); // Casa 8
    cuspsDeg[8] = normalize360(cuspsDeg[2] + 180); // Casa 9
  }

  return cuspsDeg.map((lon, index) => {
    const signInfo = getZodiacSign(lon);
    const signDeg = getSignDegree(lon);
    return {
      house: index + 1,
      longitude: lon,
      sign: signInfo.name,
      signDegree: signDeg,
      degreeFormatted: formatDegree(signDeg),
    };
  });
}

/**
 * Determina en qué casa (1 a 12) se encuentra una longitud dada,
 * evaluando los intervalos entre las cúspides de las casas.
 */
export function getHouseForLongitude(longitude: number, houses: HouseCusp[]): number {
  const normLon = normalize360(longitude);

  for (let i = 0; i < 12; i++) {
    const currentCusp = houses[i].longitude;
    const nextCusp = houses[(i + 1) % 12].longitude;

    if (currentCusp < nextCusp) {
      if (normLon >= currentCusp && normLon < nextCusp) {
        return i + 1;
      }
    } else {
      // Cruce del meridiano de 0° (Aries)
      if (normLon >= currentCusp || normLon < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1; // Fallback seguro
}

/**
 * Asigna la casa correspondiente a cada planeta calculado
 */
export function assignHousesToPlanets(
  planets: PlanetPosition[],
  houses: HouseCusp[]
): PlanetPosition[] {
  return planets.map((p) => ({
    ...p,
    house: getHouseForLongitude(p.longitude, houses),
  }));
}
