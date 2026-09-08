import { ElementBalance, ModalityBalance, PlanetPosition } from '../types/astrology';
import { getZodiacSign } from './coordinates';

/**
 * Ponderación astrológica por cuerpo celeste para calcular balances
 */
const PLANET_WEIGHTS: Record<string, number> = {
  sun: 3,
  moon: 3,
  ascendant: 3,
  mercury: 2,
  venus: 2,
  mars: 2,
  jupiter: 1,
  saturn: 1,
  uranus: 0.5,
  neptune: 0.5,
  pluto: 0.5,
};

export function calculateElementalBalance(
  planets: PlanetPosition[],
  ascendantLongitude: number
): ElementBalance {
  let fire = 0;
  let earth = 0;
  let air = 0;
  let water = 0;

  // Incluir planetas con sus pesos
  for (const p of planets) {
    const weight = PLANET_WEIGHTS[p.id] || 1;
    const signInfo = getZodiacSign(p.longitude);

    switch (signInfo.element) {
      case 'Fuego':
        fire += weight;
        break;
      case 'Tierra':
        earth += weight;
        break;
      case 'Aire':
        air += weight;
        break;
      case 'Agua':
        water += weight;
        break;
    }
  }

  // Incluir Ascendente
  const ascSign = getZodiacSign(ascendantLongitude);
  const ascWeight = PLANET_WEIGHTS.ascendant;
  if (ascSign.element === 'Fuego') fire += ascWeight;
  if (ascSign.element === 'Tierra') earth += ascWeight;
  if (ascSign.element === 'Aire') air += ascWeight;
  if (ascSign.element === 'Agua') water += ascWeight;

  const total = fire + earth + air + water || 1;
  const firePct = Math.round((fire / total) * 100);
  const earthPct = Math.round((earth / total) * 100);
  const airPct = Math.round((air / total) * 100);
  const waterPct = Math.round((water / total) * 100);

  let dominantElement: ElementBalance['dominantElement'] = 'Fuego';
  let maxScore = firePct;
  if (earthPct > maxScore) {
    dominantElement = 'Tierra';
    maxScore = earthPct;
  }
  if (airPct > maxScore) {
    dominantElement = 'Aire';
    maxScore = airPct;
  }
  if (waterPct > maxScore) {
    dominantElement = 'Agua';
    maxScore = waterPct;
  }

  return {
    fire: firePct,
    earth: earthPct,
    air: airPct,
    water: waterPct,
    dominantElement,
  };
}

export function calculateModalityBalance(
  planets: PlanetPosition[],
  ascendantLongitude: number
): ModalityBalance {
  let cardinal = 0;
  let fixed = 0;
  let mutable = 0;

  for (const p of planets) {
    const weight = PLANET_WEIGHTS[p.id] || 1;
    const signInfo = getZodiacSign(p.longitude);

    switch (signInfo.modality) {
      case 'Cardinal':
        cardinal += weight;
        break;
      case 'Fijo':
        fixed += weight;
        break;
      case 'Mutable':
        mutable += weight;
        break;
    }
  }

  const ascSign = getZodiacSign(ascendantLongitude);
  const ascWeight = PLANET_WEIGHTS.ascendant;
  if (ascSign.modality === 'Cardinal') cardinal += ascWeight;
  if (ascSign.modality === 'Fijo') fixed += ascWeight;
  if (ascSign.modality === 'Mutable') mutable += ascWeight;

  const total = cardinal + fixed + mutable || 1;
  const cardinalPct = Math.round((cardinal / total) * 100);
  const fixedPct = Math.round((fixed / total) * 100);
  const mutablePct = Math.round((mutable / total) * 100);

  let dominantModality: ModalityBalance['dominantModality'] = 'Cardinal';
  let maxScore = cardinalPct;
  if (fixedPct > maxScore) {
    dominantModality = 'Fijo';
    maxScore = fixedPct;
  }
  if (mutablePct > maxScore) {
    dominantModality = 'Mutable';
    maxScore = mutablePct;
  }

  return {
    cardinal: cardinalPct,
    fixed: fixedPct,
    mutable: mutablePct,
    dominantModality,
  };
}
