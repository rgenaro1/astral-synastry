import { AspectResult, AspectType, PlanetId, PlanetPosition } from '../types/astrology';
import { ASPECT_DEFINITIONS, PLANET_METADATA } from './constants';
import { angularDistance } from './coordinates';

/**
 * Determina el orbe máximo permitido entre dos cuerpos celestes
 */
export function getMaxOrb(
  planet1: PlanetId | string,
  planet2: PlanetId | string,
  aspectType: AspectType
): number {
  if (aspectType === 'quincunx') {
    return 3.0;
  }

  const p1Meta = PLANET_METADATA[planet1 as PlanetId];
  const p2Meta = PLANET_METADATA[planet2 as PlanetId];

  const orb1 = p1Meta ? p1Meta.defaultOrb : 6.0;
  const orb2 = p2Meta ? p2Meta.defaultOrb : 6.0;

  // Si uno de los dos es luminaria (Sol o Luna), se permite orbe más amplio
  const baseMax = Math.max(orb1, orb2);

  // Reducción leve para aspectos menores como sextil
  if (aspectType === 'sextile') {
    return Math.min(baseMax, 6.0);
  }
  if (aspectType === 'square' || aspectType === 'trine' || aspectType === 'opposition') {
    return Math.min(baseMax, 8.5);
  }

  return baseMax;
}

/**
 * Determina la naturaleza del aspecto teniendo en cuenta la afinidad de los planetas
 */
export function determineAspectNature(
  aspectType: AspectType,
  planet1: PlanetId | string,
  planet2: PlanetId | string
): 'harmonious' | 'challenging' | 'neutral' | 'intense' {
  if (aspectType === 'trine' || aspectType === 'sextile') {
    return 'harmonious';
  }
  if (aspectType === 'square' || aspectType === 'opposition' || aspectType === 'quincunx') {
    return 'challenging';
  }

  // Conjunción: depende de los planetas involucrados
  const benefics = ['venus', 'jupiter', 'sun'];
  const malefics = ['mars', 'saturn', 'pluto', 'uranus'];

  const hasBenefic = benefics.includes(planet1) || benefics.includes(planet2);
  const hasMalefic = malefics.includes(planet1) || malefics.includes(planet2);

  if (hasBenefic && !hasMalefic) {
    return 'harmonious';
  }
  if (hasMalefic) {
    return 'challenging';
  }

  return 'intense';
}

/**
 * Evalúa si existe un aspecto entre dos cuerpos con sus respectivas longitudes eclípticas
 */
export function evaluateAspect(
  planet1Id: PlanetId | string,
  planet1Name: string,
  lon1: number,
  planet2Id: PlanetId | string,
  planet2Name: string,
  lon2: number
): AspectResult | null {
  const diff = angularDistance(lon1, lon2);
  const aspectTypes: AspectType[] = [
    'conjunction',
    'opposition',
    'trine',
    'square',
    'sextile',
    'quincunx',
  ];

  for (const type of aspectTypes) {
    const def = ASPECT_DEFINITIONS[type];
    const maxOrb = getMaxOrb(planet1Id, planet2Id, type);
    const orb = Math.abs(diff - def.angle);

    if (orb <= maxOrb) {
      // Fuerza normalizada de 0 a 100% (orbe 0° = 100% fuerza)
      const strength = Math.round((1 - orb / maxOrb) * 100);
      const nature = determineAspectNature(type, planet1Id, planet2Id);

      return {
        planet1: planet1Id,
        planet2: planet2Id,
        planet1Name,
        planet2Name,
        type,
        typeName: def.name,
        symbol: def.symbol,
        angle: def.angle,
        actualAngle: Math.round(diff * 100) / 100,
        orb: Math.round(orb * 100) / 100,
        strength,
        nature,
      };
    }
  }

  return null;
}

/**
 * Calcula todos los aspectos internos de una carta natal
 */
export function calculateChartAspects(planets: PlanetPosition[]): AspectResult[] {
  const aspects: AspectResult[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      // Evitar aspectos automáticos entre nodo norte y nodo sur (siempre están a 180°)
      if (
        (p1.id === 'north_node' && p2.id === 'south_node') ||
        (p1.id === 'south_node' && p2.id === 'north_node')
      ) {
        continue;
      }

      const aspect = evaluateAspect(p1.id, p1.name, p1.longitude, p2.id, p2.name, p2.longitude);
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }

  // Ordenar aspectos por mayor fuerza
  return aspects.sort((a, b) => b.strength - a.strength);
}
