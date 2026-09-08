import {
  ZodiacSignInfo,
  AspectDefinition,
  PlanetId,
  ElementType,
  ModalityType,
  AspectType,
} from '../types/astrology';

// ============================================================================
// SIGNOS DEL ZODIACO
// ============================================================================

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'Fuego',
    modality: 'Cardinal',
    ruler: 'Marte',
    startDegree: 0,
    endDegree: 30,
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'Tierra',
    modality: 'Fijo',
    ruler: 'Venus',
    startDegree: 30,
    endDegree: 60,
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'Aire',
    modality: 'Mutable',
    ruler: 'Mercurio',
    startDegree: 60,
    endDegree: 90,
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'Agua',
    modality: 'Cardinal',
    ruler: 'Luna',
    startDegree: 90,
    endDegree: 120,
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'Fuego',
    modality: 'Fijo',
    ruler: 'Sol',
    startDegree: 120,
    endDegree: 150,
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'Tierra',
    modality: 'Mutable',
    ruler: 'Mercurio',
    startDegree: 150,
    endDegree: 180,
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Aire',
    modality: 'Cardinal',
    ruler: 'Venus',
    startDegree: 180,
    endDegree: 210,
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'Agua',
    modality: 'Fijo',
    ruler: 'Plutón',
    startDegree: 210,
    endDegree: 240,
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fuego',
    modality: 'Mutable',
    ruler: 'Júpiter',
    startDegree: 240,
    endDegree: 270,
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'Tierra',
    modality: 'Cardinal',
    ruler: 'Saturno',
    startDegree: 270,
    endDegree: 300,
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'Aire',
    modality: 'Fijo',
    ruler: 'Urano',
    startDegree: 300,
    endDegree: 330,
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'Agua',
    modality: 'Mutable',
    ruler: 'Neptuno',
    startDegree: 330,
    endDegree: 360,
  },
];

// ============================================================================
// METADATOS DE CUERPOS CELESTES
// ============================================================================

export interface PlanetMeta {
  id: PlanetId;
  nameEs: string;
  nameEn: string;
  symbol: string;
  category: 'luminary' | 'personal' | 'social' | 'transpersonal' | 'point';
  defaultOrb: number;
}

export const PLANET_METADATA: Record<PlanetId, PlanetMeta> = {
  sun: {
    id: 'sun',
    nameEs: 'Sol',
    nameEn: 'Sun',
    symbol: '☉',
    category: 'luminary',
    defaultOrb: 10,
  },
  moon: {
    id: 'moon',
    nameEs: 'Luna',
    nameEn: 'Moon',
    symbol: '☽',
    category: 'luminary',
    defaultOrb: 10,
  },
  mercury: {
    id: 'mercury',
    nameEs: 'Mercurio',
    nameEn: 'Mercury',
    symbol: '☿',
    category: 'personal',
    defaultOrb: 8,
  },
  venus: {
    id: 'venus',
    nameEs: 'Venus',
    nameEn: 'Venus',
    symbol: '♀',
    category: 'personal',
    defaultOrb: 8,
  },
  mars: {
    id: 'mars',
    nameEs: 'Marte',
    nameEn: 'Mars',
    symbol: '♂',
    category: 'personal',
    defaultOrb: 8,
  },
  jupiter: {
    id: 'jupiter',
    nameEs: 'Júpiter',
    nameEn: 'Jupiter',
    symbol: '♃',
    category: 'social',
    defaultOrb: 6,
  },
  saturn: {
    id: 'saturn',
    nameEs: 'Saturno',
    nameEn: 'Saturn',
    symbol: '♄',
    category: 'social',
    defaultOrb: 6,
  },
  uranus: {
    id: 'uranus',
    nameEs: 'Urano',
    nameEn: 'Uranus',
    symbol: '♅',
    category: 'transpersonal',
    defaultOrb: 5,
  },
  neptune: {
    id: 'neptune',
    nameEs: 'Neptuno',
    nameEn: 'Neptune',
    symbol: '♆',
    category: 'transpersonal',
    defaultOrb: 5,
  },
  pluto: {
    id: 'pluto',
    nameEs: 'Plutón',
    nameEn: 'Pluto',
    symbol: '♇',
    category: 'transpersonal',
    defaultOrb: 5,
  },
  chiron: {
    id: 'chiron',
    nameEs: 'Quirón',
    nameEn: 'Chiron',
    symbol: '⚷',
    category: 'point',
    defaultOrb: 4,
  },
  north_node: {
    id: 'north_node',
    nameEs: 'Nodo Norte',
    nameEn: 'North Node',
    symbol: '☊',
    category: 'point',
    defaultOrb: 4,
  },
  south_node: {
    id: 'south_node',
    nameEs: 'Nodo Sur',
    nameEn: 'South Node',
    symbol: '☋',
    category: 'point',
    defaultOrb: 4,
  },
};

// ============================================================================
// DEFINICIÓN DE ASPECTOS
// ============================================================================

export const ASPECT_DEFINITIONS: Record<AspectType, AspectDefinition> = {
  conjunction: {
    type: 'conjunction',
    name: 'Conjunción',
    symbol: '☌',
    angle: 0,
    defaultOrb: 8,
    nature: 'intense',
  },
  opposition: {
    type: 'opposition',
    name: 'Oposición',
    symbol: '☍',
    angle: 180,
    defaultOrb: 8,
    nature: 'challenging',
  },
  trine: {
    type: 'trine',
    name: 'Trígono',
    symbol: '△',
    angle: 120,
    defaultOrb: 8,
    nature: 'harmonious',
  },
  square: {
    type: 'square',
    name: 'Cuadratura',
    symbol: '□',
    angle: 90,
    defaultOrb: 7,
    nature: 'challenging',
  },
  sextile: {
    type: 'sextile',
    name: 'Sextil',
    symbol: '⚹',
    angle: 60,
    defaultOrb: 6,
    nature: 'harmonious',
  },
  quincunx: {
    type: 'quincunx',
    name: 'Quincuncio',
    symbol: '⚻',
    angle: 150,
    defaultOrb: 3,
    nature: 'challenging',
  },
};
