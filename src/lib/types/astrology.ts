// ============================================================================
// CORE ASTROLOGICAL DATA TYPES & INTERFACES (ENHANCED EDITION)
// ============================================================================

export type ZodiacSignName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type ElementType = 'Fuego' | 'Tierra' | 'Aire' | 'Agua';
export type ModalityType = 'Cardinal' | 'Fijo' | 'Mutable';

export interface ZodiacSignInfo {
  name: ZodiacSignName;
  symbol: string;
  element: ElementType;
  modality: ModalityType;
  ruler: string;
  startDegree: number; // 0, 30, 60...
  endDegree: number;
}

export type PlanetId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'chiron'
  | 'north_node'
  | 'south_node';

export interface PlanetPosition {
  id: PlanetId;
  name: string;
  symbol: string;
  longitude: number; // 0 - 360
  latitude?: number;
  speed: number; // degrees per day (negative = retrograde)
  isRetrograde: boolean;
  sign: ZodiacSignName;
  signDegree: number; // 0 - 29.999
  degreeFormatted: string; // e.g. "14° 23' 12\""
  house: number; // 1 - 12
}

export interface AnglePoint {
  id: 'ascendant' | 'midheaven' | 'descendant' | 'imum_coeli';
  name: string;
  symbol: string;
  longitude: number;
  sign: ZodiacSignName;
  signDegree: number;
  degreeFormatted: string;
}

export interface HouseCusp {
  house: number; // 1 - 12
  longitude: number; // 0 - 360
  sign: ZodiacSignName;
  signDegree: number;
  degreeFormatted: string;
}

export type AspectType =
  | 'conjunction'
  | 'opposition'
  | 'trine'
  | 'square'
  | 'sextile'
  | 'quincunx';

export interface AspectDefinition {
  type: AspectType;
  name: string;
  symbol: string;
  angle: number; // 0, 180, 120, 90, 60, 150
  defaultOrb: number;
  nature: 'harmonious' | 'challenging' | 'neutral' | 'intense';
}

export interface AspectResult {
  planet1: PlanetId | string;
  planet2: PlanetId | string;
  planet1Name: string;
  planet2Name: string;
  type: AspectType;
  typeName: string;
  symbol: string;
  angle: number;
  actualAngle: number;
  orb: number;
  strength: number;
  nature: 'harmonious' | 'challenging' | 'neutral' | 'intense';
  isApplying?: boolean;
}

export interface ElementBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominantElement: ElementType;
}

export interface ModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
  dominantModality: ModalityType;
}

export type HouseSystem = 'placidus' | 'whole-sign' | 'equal';

export interface BirthProfileInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm (24h)
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneIana: string;
}

export interface BirthProfileResolved extends BirthProfileInput {
  birthUtc: string; // ISO 8601 UTC
  utcOffsetMinutes: number;
  julianDay: number;
}

export interface NatalChart {
  profile: BirthProfileResolved;
  houseSystem: HouseSystem;
  planets: PlanetPosition[];
  angles: {
    ascendant: AnglePoint;
    midheaven: AnglePoint;
    descendant: AnglePoint;
    imumCoeli: AnglePoint;
  };
  houses: HouseCusp[];
  aspects: AspectResult[];
  elements: ElementBalance;
  modalities: ModalityBalance;
  calculatedAt: string;
}

// ============================================================================
// SINASTRÍA & COMPATIBILIDAD
// ============================================================================

export interface InterChartAspect extends AspectResult {
  person1Planet: PlanetId;
  person2Planet: PlanetId;
  person1Name: string;
  person2Name: string;
  category:
    | 'emotional'
    | 'communication'
    | 'love'
    | 'attraction'
    | 'stability'
    | 'intensity'
    | 'conflict';
}

export interface HouseOverlay {
  planet: PlanetId;
  planetName: string;
  planetOwner: 'personA' | 'personB';
  fallsInHouseOfOther: number; // 1 - 12
  houseOwner: 'personA' | 'personB';
  sign: ZodiacSignName;
  degree: number;
  significance: string;
}

export interface CompatibilityDimension {
  id:
    | 'emotional'
    | 'communication'
    | 'attraction'
    | 'romance'
    | 'stability'
    | 'intensity'
    | 'conflict'
    | 'growth'
    | 'daily';
  name: string;
  score: number; // 0 - 100
  level: string;
  summary: string;
  positiveFactors: string[];
  challengeFactors: string[];
}

export interface SynastryAnalysis {
  personA: BirthProfileResolved;
  personB: BirthProfileResolved;
  aspects: InterChartAspect[];
  overlaysAInB: HouseOverlay[];
  overlaysBInA: HouseOverlay[];
  dimensions: CompatibilityDimension[];
  overallCompatibility: {
    averageScore: number;
    harmonyIndex: number;
    archetypeTitle: string;
  };
}

// ============================================================================
// CARTA COMPUESTA
// ============================================================================

export interface CompositePlanet {
  id: PlanetId;
  name: string;
  symbol: string;
  longitude: number;
  sign: ZodiacSignName;
  signDegree: number;
  degreeFormatted: string;
  house: number;
}

export interface CompositeChart {
  relationshipTitle: string;
  planets: CompositePlanet[];
  houses: HouseCusp[];
  angles: {
    ascendant: AnglePoint;
    midheaven: AnglePoint;
    descendant: AnglePoint;
    imumCoeli: AnglePoint;
  };
  aspects: AspectResult[];
  coreEnergy: string;
}

// ============================================================================
// GUÍA PRÁCTICA DE EVOLUCIÓN VINCULAR Y RECOMENDACIONES
// ============================================================================

export interface RelationshipRecommendations {
  title: string;
  subtitle: string;
  communicationProtocol: {
    title: string;
    adviceForPersonA: string;
    adviceForPersonB: string;
    goldenBridge: string;
  };
  loveLanguages: {
    title: string;
    needsOfPersonA: string;
    needsOfPersonB: string;
    sacredHarmonyAction: string;
  };
  deescalationGuide: {
    title: string;
    triggerPatterns: string;
    step1Pause: string;
    step2Empathy: string;
    step3Repair: string;
  };
  deepConnectionRituals: {
    title: string;
    rituals: string[];
  };
  reflectionQuestions: string[];
}

// ============================================================================
// REPORTE DE IA PROFUNDO Y EXTENSO
// ============================================================================

export interface AIInterpretationReport {
  id?: string;
  modelVersion: string;
  sections: {
    encounter: {
      title: string;
      narrative: string;
      soulContract: string;
    };
    personA: {
      title: string;
      identity: string;
      emotionalWorld: string;
      relationalStyle: string;
      hiddenWoundAndGift: string;
    };
    personB: {
      title: string;
      identity: string;
      emotionalWorld: string;
      relationalStyle: string;
      hiddenWoundAndGift: string;
    };
    relationship: {
      title: string;
      loveAndEmotions: string;
      communicationAndMind: string;
      attractionAndChemistry: string;
      stabilityAndCommitment: string;
      frictionAndEvolution: string;
    };
    hiddenPatterns: {
      title: string;
      karmicNodes: string;
      unconsciousDynamics: string;
      attachmentStyles: string;
    };
    compositeSoul: {
      title: string;
      centralPurpose: string;
      strengthsAndGifts: string;
      shadowAndPitfalls: string;
      adviceForThriving: string;
    };
    compatibilityMap: {
      title: string;
      dimensionalReview: string;
      synthesis: string;
    };
  };
  recommendations: RelationshipRecommendations;
  generatedAt: string;
}
