import {
  CompositeChart,
  CompositePlanet,
  HouseCusp,
  NatalChart,
  PlanetId,
} from '../types/astrology';
import {
  normalize360,
  getZodiacSign,
  getSignDegree,
  formatDegree,
} from '../astronomy/coordinates';
import { calculateHouses, getHouseForLongitude } from '../astronomy/houses';
import { evaluateAspect } from '../astronomy/aspects';

/**
 * Calcula el punto medio entre dos longitudes por el arco menor (< 180°)
 */
export function calculateMidpoint(lon1: number, lon2: number): number {
  const norm1 = normalize360(lon1);
  const norm2 = normalize360(lon2);
  const diff = Math.abs(norm1 - norm2);

  let mid = (norm1 + norm2) / 2;
  if (diff > 180) {
    mid = normalize360(mid + 180);
  }
  return normalize360(mid);
}

/**
 * Calcula la Carta Compuesta (Midpoint Composite Chart) de dos cartas natales
 */
export function calculateCompositeChart(
  chartA: NatalChart,
  chartB: NatalChart
): CompositeChart {
  const relationshipTitle = `${chartA.profile.name} & ${chartB.profile.name}`;

  // 1. Puntos medios de cada planeta
  const compositePlanetsRaw = chartA.planets.map((pA) => {
    const pB = chartB.planets.find((p) => p.id === pA.id);
    const lonB = pB ? pB.longitude : pA.longitude;
    const midLon = calculateMidpoint(pA.longitude, lonB);
    const signInfo = getZodiacSign(midLon);
    const signDeg = getSignDegree(midLon);

    return {
      id: pA.id,
      name: pA.name,
      symbol: pA.symbol,
      longitude: midLon,
      sign: signInfo.name,
      signDegree: signDeg,
      degreeFormatted: formatDegree(signDeg),
      house: 1, // se asigna abajo
    };
  });

  // 2. Ángulos compuestos (MC y Ascendente)
  const compMcLon = calculateMidpoint(
    chartA.angles.midheaven.longitude,
    chartB.angles.midheaven.longitude
  );
  const compAscLon = calculateMidpoint(
    chartA.angles.ascendant.longitude,
    chartB.angles.ascendant.longitude
  );
  const compDscLon = normalize360(compAscLon + 180);
  const compIcLon = normalize360(compMcLon + 180);

  const createCompAngle = (id: any, name: string, symbol: string, lon: number) => {
    const sign = getZodiacSign(lon);
    const deg = getSignDegree(lon);
    return {
      id,
      name,
      symbol,
      longitude: lon,
      sign: sign.name,
      signDegree: deg,
      degreeFormatted: formatDegree(deg),
    };
  };

  const angles = {
    ascendant: createCompAngle('ascendant', 'Ascendente Compuesto', 'AC', compAscLon),
    midheaven: createCompAngle('midheaven', 'Medio Cielo Compuesto', 'MC', compMcLon),
    descendant: createCompAngle('descendant', 'Descendente Compuesto', 'DC', compDscLon),
    imumCoeli: createCompAngle('imum_coeli', 'Fondo del Cielo Compuesto', 'IC', compIcLon),
  };

  // 3. Casas compuestas (mediante puntos medios de cúspides de casas de A y B)
  const houses: HouseCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const cuspA = chartA.houses[i].longitude;
    const cuspB = chartB.houses[i].longitude;
    const midCusp = calculateMidpoint(cuspA, cuspB);
    const sign = getZodiacSign(midCusp);
    const deg = getSignDegree(midCusp);

    houses.push({
      house: i + 1,
      longitude: midCusp,
      sign: sign.name,
      signDegree: deg,
      degreeFormatted: formatDegree(deg),
    });
  }

  // 4. Asignar casas a planetas compuestos
  const planets: CompositePlanet[] = compositePlanetsRaw.map((cp) => ({
    ...cp,
    house: getHouseForLongitude(cp.longitude, houses),
  }));

  // 5. Aspectos internos de la carta compuesta
  const aspects: any[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      if (
        (p1.id === 'north_node' && p2.id === 'south_node') ||
        (p1.id === 'south_node' && p2.id === 'north_node')
      ) {
        continue;
      }

      const asp = evaluateAspect(p1.id, p1.name, p1.longitude, p2.id, p2.name, p2.longitude);
      if (asp) {
        aspects.push(asp);
      }
    }
  }
  aspects.sort((a, b) => b.strength - a.strength);

  // 6. Resumen de energía central
  const compSun = planets.find((p) => p.id === 'sun')!;
  const compMoon = planets.find((p) => p.id === 'moon')!;
  const coreEnergy = `Vínculo con Sol Compuesto en ${compSun?.sign || 'Aries'} (Casa ${compSun?.house || 1}) y Luna Compuesta en ${compMoon?.sign || 'Tauro'} (Casa ${compMoon?.house || 1}). Propósito canalizado hacia el signo de ${angles.ascendant.sign}.`;

  return {
    relationshipTitle,
    planets,
    houses,
    angles,
    aspects,
    coreEnergy,
  };
}
