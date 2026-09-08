import {
  InterChartAspect,
  NatalChart,
  PlanetId,
} from '../types/astrology';
import { evaluateAspect } from '../astronomy/aspects';

/**
 * Clasifica un aspecto inter-cartas en su categoría arquetípica de sinastría
 */
export function categorizeInterAspect(
  p1: PlanetId,
  p2: PlanetId,
  nature: 'harmonious' | 'challenging' | 'neutral' | 'intense'
): InterChartAspect['category'] {
  const pair = [p1, p2].sort();
  const pairStr = `${pair[0]}_${pair[1]}`;

  // Tensión y conflicto
  if (
    nature === 'challenging' &&
    (pair.includes('mars') || pair.includes('saturn') || pair.includes('pluto') || pair.includes('uranus'))
  ) {
    return 'conflict';
  }

  // Conexión emocional (Luna)
  if (
    pairStr === 'moon_moon' ||
    pairStr === 'moon_sun' ||
    pairStr === 'moon_venus' ||
    pairStr === 'moon_saturn' ||
    pairStr === 'moon_neptune'
  ) {
    return 'emotional';
  }

  // Comunicación (Mercurio)
  if (
    pairStr === 'mercury_mercury' ||
    pairStr === 'mercury_moon' ||
    pairStr === 'mars_mercury' ||
    pairStr === 'mercury_sun' ||
    pairStr === 'mercury_jupiter' ||
    pairStr === 'mercury_uranus'
  ) {
    return 'communication';
  }

  // Amor y afecto (Venus)
  if (
    pairStr === 'sun_venus' ||
    pairStr === 'venus_venus' ||
    pairStr === 'jupiter_venus' ||
    pairStr === 'neptune_venus'
  ) {
    return 'love';
  }

  // Atracción y magnetismo (Venus/Marte/Plutón)
  if (
    pairStr === 'mars_venus' ||
    pairStr === 'mars_mars' ||
    pairStr === 'pluto_venus' ||
    pairStr === 'mars_pluto' ||
    pairStr === 'sun_mars'
  ) {
    return 'attraction';
  }

  // Estabilidad y compromiso (Saturno)
  if (
    pair.includes('saturn') &&
    (pair.includes('sun') || pair.includes('venus') || pair.includes('mercury') || pair.includes('jupiter'))
  ) {
    return 'stability';
  }

  // Intensidad y transformación (Plutón y Nodos)
  if (
    pair.includes('pluto') ||
    pair.includes('north_node') ||
    pair.includes('south_node') ||
    pair.includes('chiron')
  ) {
    return 'intensity';
  }

  return 'love';
}

/**
 * Calcula todos los aspectos cruzados entre la Carta A y la Carta B
 */
export function calculateInterChartAspects(
  chartA: NatalChart,
  chartB: NatalChart
): InterChartAspect[] {
  const aspects: InterChartAspect[] = [];

  for (const pA of chartA.planets) {
    for (const pB of chartB.planets) {
      // Ignorar aspectos redundantes entre nodos opuestos
      if (
        (pA.id === 'north_node' && pB.id === 'south_node') ||
        (pA.id === 'south_node' && pB.id === 'north_node')
      ) {
        continue;
      }

      const aspectResult = evaluateAspect(
        pA.id,
        pA.name,
        pA.longitude,
        pB.id,
        pB.name,
        pB.longitude
      );

      if (aspectResult) {
        const category = categorizeInterAspect(pA.id, pB.id, aspectResult.nature);

        aspects.push({
          ...aspectResult,
          person1Planet: pA.id,
          person2Planet: pB.id,
          person1Name: chartA.profile.name,
          person2Name: chartB.profile.name,
          category,
        });
      }
    }
  }

  // Ordenar por fuerza descendente (orbe más cerrado primero)
  return aspects.sort((a, b) => b.strength - a.strength);
}
