import {
  BirthProfileInput,
  HouseSystem,
  NatalChart,
} from '../types/astrology';
import { resolveHistoricDateTime } from '../geo/timezone';
import { calculatePlanetaryPositions } from './ephemeris';
import {
  calculateAngles,
  calculateHouses,
  assignHousesToPlanets,
} from './houses';
import { calculateChartAspects } from './aspects';
import {
  calculateElementalBalance,
  calculateModalityBalance,
} from './elements';

/**
 * Función principal para generar una Carta Natal determinista de alta precisión matemática
 */
export function calculateNatalChart(
  input: BirthProfileInput,
  houseSystem: HouseSystem = 'placidus'
): NatalChart {
  // 1. Resolver fecha/hora histórica, zona horaria IANA, offset DST y día juliano
  const resolvedProfile = resolveHistoricDateTime(input);
  const date = new Date(resolvedProfile.birthUtc);

  // 2. Calcular posiciones planetarias helio y geocéntricas con velocidades
  const rawPlanets = calculatePlanetaryPositions(
    resolvedProfile.birthUtc,
    resolvedProfile.julianDay
  );

  // 3. Calcular ángulos principales (ASC, MC, DSC, IC) y tiempo sideral
  const anglesData = calculateAngles(
    date,
    resolvedProfile.latitude,
    resolvedProfile.longitude,
    resolvedProfile.julianDay
  );

  // 4. Calcular cúspides de las 12 casas según el sistema seleccionado
  const houses = calculateHouses(
    houseSystem,
    anglesData.ramc,
    resolvedProfile.latitude,
    anglesData.eps,
    anglesData.ascendant.longitude,
    anglesData.midheaven.longitude
  );

  // 5. Asignar las casas exactas a los planetas calculados
  const planetsWithHouses = assignHousesToPlanets(rawPlanets, houses);

  // 6. Detectar aspectos internos entre cuerpos celestes
  const aspects = calculateChartAspects(planetsWithHouses);

  // 7. Calcular balances de elementos y modalidades
  const elements = calculateElementalBalance(
    planetsWithHouses,
    anglesData.ascendant.longitude
  );
  const modalities = calculateModalityBalance(
    planetsWithHouses,
    anglesData.ascendant.longitude
  );

  return {
    profile: resolvedProfile,
    houseSystem,
    planets: planetsWithHouses,
    angles: {
      ascendant: anglesData.ascendant,
      midheaven: anglesData.midheaven,
      descendant: anglesData.descendant,
      imumCoeli: anglesData.imumCoeli,
    },
    houses,
    aspects,
    elements,
    modalities,
    calculatedAt: new Date().toISOString(),
  };
}
