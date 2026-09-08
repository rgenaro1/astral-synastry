import {
  CompositeChart,
  NatalChart,
  SynastryAnalysis,
} from '../types/astrology';

export interface SynastryContextDigest {
  personA: {
    name: string;
    birthInfo: string;
    sun: { sign: string; degree: string; house: number };
    moon: { sign: string; degree: string; house: number };
    mercury: { sign: string; degree: string; house: number };
    venus: { sign: string; degree: string; house: number };
    mars: { sign: string; degree: string; house: number };
    ascendant: { sign: string; degree: string };
    dominantElement: string;
    dominantModality: string;
  };
  personB: {
    name: string;
    birthInfo: string;
    sun: { sign: string; degree: string; house: number };
    moon: { sign: string; degree: string; house: number };
    mercury: { sign: string; degree: string; house: number };
    venus: { sign: string; degree: string; house: number };
    mars: { sign: string; degree: string; house: number };
    ascendant: { sign: string; degree: string };
    dominantElement: string;
    dominantModality: string;
  };
  topInterAspects: {
    pair: string;
    aspect: string;
    orb: number;
    strength: number;
    nature: string;
    category: string;
  }[];
  keyHouseOverlays: {
    owner: string;
    planet: string;
    fallsInHouse: number;
    otherName: string;
  }[];
  composite: {
    title: string;
    sun: { sign: string; house: number };
    moon: { sign: string; house: number };
    ascendant: { sign: string };
    coreAspects: string[];
    coreEnergy: string;
  };
  compatibilityScores: {
    dimension: string;
    score: number;
    level: string;
    positives: string[];
    challenges: string[];
  }[];
  overall: {
    averageScore: number;
    archetypeTitle: string;
  };
}

/**
 * Reduce y serializa el conjunto astronómico a un digest semántico ultra-denso
 * para optimizar tokens y maximizar la coherencia del modelo de IA.
 */
export function buildSynastryDigest(
  chartA: NatalChart,
  chartB: NatalChart,
  synastry: SynastryAnalysis,
  composite: CompositeChart
): SynastryContextDigest {
  const getPlanet = (chart: NatalChart, id: string) => {
    const p = chart.planets.find((item) => item.id === id);
    return {
      sign: p?.sign || '',
      degree: p?.degreeFormatted || '',
      house: p?.house || 1,
    };
  };

  // Top 12 aspectos más intensos
  const topAspects = synastry.aspects.slice(0, 14).map((a) => ({
    pair: `${chartA.profile.name} (${a.person1Planet}) ↔ ${chartB.profile.name} (${a.person2Planet})`,
    aspect: a.typeName,
    orb: a.orb,
    strength: a.strength,
    nature: a.nature,
    category: a.category,
  }));

  // Overlays de casas angulares y relacionales (1, 4, 5, 7, 8, 10, 12)
  const relHouses = [1, 4, 5, 7, 8, 10, 12];
  const overlaysA = synastry.overlaysAInB
    .filter((o) => relHouses.includes(o.fallsInHouseOfOther))
    .slice(0, 6)
    .map((o) => ({
      owner: chartA.profile.name,
      planet: o.planetName,
      fallsInHouse: o.fallsInHouseOfOther,
      otherName: chartB.profile.name,
    }));

  const overlaysB = synastry.overlaysBInA
    .filter((o) => relHouses.includes(o.fallsInHouseOfOther))
    .slice(0, 6)
    .map((o) => ({
      owner: chartB.profile.name,
      planet: o.planetName,
      fallsInHouse: o.fallsInHouseOfOther,
      otherName: chartA.profile.name,
    }));

  const compSun = composite.planets.find((p) => p.id === 'sun')!;
  const compMoon = composite.planets.find((p) => p.id === 'moon')!;

  return {
    personA: {
      name: chartA.profile.name,
      birthInfo: `${chartA.profile.birthDate} ${chartA.profile.birthTime}, ${chartA.profile.city}, ${chartA.profile.country}`,
      sun: getPlanet(chartA, 'sun'),
      moon: getPlanet(chartA, 'moon'),
      mercury: getPlanet(chartA, 'mercury'),
      venus: getPlanet(chartA, 'venus'),
      mars: getPlanet(chartA, 'mars'),
      ascendant: {
        sign: chartA.angles.ascendant.sign,
        degree: chartA.angles.ascendant.degreeFormatted,
      },
      dominantElement: chartA.elements.dominantElement,
      dominantModality: chartA.modalities.dominantModality,
    },
    personB: {
      name: chartB.profile.name,
      birthInfo: `${chartB.profile.birthDate} ${chartB.profile.birthTime}, ${chartB.profile.city}, ${chartB.profile.country}`,
      sun: getPlanet(chartB, 'sun'),
      moon: getPlanet(chartB, 'moon'),
      mercury: getPlanet(chartB, 'mercury'),
      venus: getPlanet(chartB, 'venus'),
      mars: getPlanet(chartB, 'mars'),
      ascendant: {
        sign: chartB.angles.ascendant.sign,
        degree: chartB.angles.ascendant.degreeFormatted,
      },
      dominantElement: chartB.elements.dominantElement,
      dominantModality: chartB.modalities.dominantModality,
    },
    topInterAspects: topAspects,
    keyHouseOverlays: [...overlaysA, ...overlaysB],
    composite: {
      title: composite.relationshipTitle,
      sun: { sign: compSun?.sign || '', house: compSun?.house || 1 },
      moon: { sign: compMoon?.sign || '', house: compMoon?.house || 1 },
      ascendant: { sign: composite.angles.ascendant.sign },
      coreAspects: composite.aspects.slice(0, 5).map((a) => `${a.planet1Name} ${a.typeName} ${a.planet2Name} (orbe ${a.orb}°)`),
      coreEnergy: composite.coreEnergy,
    },
    compatibilityScores: synastry.dimensions.map((d) => ({
      dimension: d.name,
      score: d.score,
      level: d.level,
      positives: d.positiveFactors.slice(0, 2),
      challenges: d.challengeFactors.slice(0, 2),
    })),
    overall: {
      averageScore: synastry.overallCompatibility.averageScore,
      archetypeTitle: synastry.overallCompatibility.archetypeTitle,
    },
  };
}
