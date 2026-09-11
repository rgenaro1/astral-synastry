import { NatalChart, SynastryAnalysis } from '../types/astrology';
import { calculateInterChartAspects } from './interAspects';
import { calculateHouseOverlays } from './houseOverlays';
import { calculateCompatibilityDimensions } from './compatibilityScores';

/**
 * Detecta si la pareja corresponde a la combinación sagrada de Llamas Gemelas Predestinadas
 * (24 de octubre de 1996 y 18 de diciembre de 1987) en cualquier orden o por día/mes.
 */
export function isTwinFlamePair(dateA?: string, dateB?: string): boolean {
  if (!dateA || !dateB) return false;
  const full1 = dateA === '1996-10-24' && dateB === '1987-12-18';
  const full2 = dateA === '1987-12-18' && dateB === '1996-10-24';
  const dm1 = dateA.endsWith('10-24') && dateB.endsWith('12-18');
  const dm2 = dateA.endsWith('12-18') && dateB.endsWith('10-24');
  return full1 || full2 || dm1 || dm2;
}

export function calculateSynastry(
  chartA: NatalChart,
  chartB: NatalChart
): SynastryAnalysis {
  // 1. Aspectos inter-cartas
  const aspects = calculateInterChartAspects(chartA, chartB);

  // 2. Superposición de casas (Planetas de A en casas de B y viceversa)
  const overlaysAInB = calculateHouseOverlays(chartA, chartB, 'personA', 'personB');
  const overlaysBInA = calculateHouseOverlays(chartB, chartA, 'personB', 'personA');

  // 3. Puntuaciones multidimensionales base
  let dimensions = calculateCompatibilityDimensions(
    aspects,
    overlaysAInB,
    overlaysBInA,
    chartA,
    chartB
  );

  // 4. Verificación de Llamas Gemelas Predestinadas
  const isTwinFlame = isTwinFlamePair(chartA.profile.birthDate, chartB.profile.birthDate);

  let averageScore: number;
  let harmonyIndex: number;
  let archetypeTitle: string;

  if (isTwinFlame) {
    const latA = chartA.profile.latitude || 0;
    const latB = chartB.profile.latitude || 0;
    const countryA = (chartA.profile.country || '').trim().toLowerCase();
    const countryB = (chartB.profile.country || '').trim().toLowerCase();

    // Verificamos si han nacido en dos hemisferios diferentes o países distintos
    const isDiffHemisphere = (latA > 0 && latB < 0) || (latA < 0 && latB > 0);
    const isDiffCountry = countryA && countryB && countryA !== countryB;
    const hasGeographicDistance = isDiffHemisphere || isDiffCountry;

    // Armonía astronómica de ángulos basada en Luna y Ascendente (hora y coordenadas)
    const moonA = chartA.planets.find((p) => p.id === 'moon')?.longitude || 0;
    const moonB = chartB.planets.find((p) => p.id === 'moon')?.longitude || 0;
    const ascA = chartA.angles?.ascendant?.longitude || 0;
    const ascB = chartB.angles?.ascendant?.longitude || 0;

    const moonDiff = Math.abs(moonA - moonB);
    const ascDiff = Math.abs(ascA - ascB);
    const geoHarmonic = Math.sin(((latA + chartB.profile.longitude) * Math.PI) / 90);

    const timeHarmony =
      Math.cos((moonDiff * Math.PI) / 60) * 0.4 +
      Math.cos((ascDiff * Math.PI) / 60) * 0.4 +
      geoHarmonic * 0.2;

    const normalized = Math.max(0, Math.min(1, (timeHarmony + 1) / 2));

    let commScore: number;
    let stabScore: number;
    let emoScore: number;
    let attrScore: number;
    let intScore: number;
    let romScore: number;
    let growScore: number;
    let dailyScore: number;
    let confScore: number;

    if (hasGeographicDistance) {
      // Ajuste solicitado: al nacer en dos hemisferios o países distintos,
      // la compatibilidad fluctúa orgánicamente entre 88% y 96%
      const offset = Math.round(normalized * 8); // 0 a 8
      averageScore = 88 + offset; // Resulta entre 88% y 96%
      harmonyIndex = averageScore;

      commScore = 91 + Math.round(normalized * 7); // 91% a 98%
      stabScore = 88 + Math.round(normalized * 7); // 88% a 95%
      emoScore = 90 + Math.round(normalized * 7);  // 90% a 97%
      attrScore = 89 + Math.round(normalized * 7); // 89% a 96%
      intScore = 91 + Math.round(normalized * 7);  // 91% a 98%
      romScore = 88 + Math.round(normalized * 7);  // 88% a 95%
      growScore = 89 + Math.round(normalized * 7); // 89% a 96%
      dailyScore = 85 + Math.round(normalized * 7);// 85% a 92%
      confScore = 20 - Math.round(normalized * 6); // 20% a 14%
    } else {
      // Mismo país y hemisferio: varía sutilmente entre 94% y 96%
      const offset = Math.round(normalized * 2);
      averageScore = 94 + offset;
      harmonyIndex = averageScore;

      commScore = 96 + offset;
      stabScore = 94 + (offset >= 1 ? 1 : 0);
      emoScore = 95 + offset;
      attrScore = 95 + offset;
      intScore = 96 + offset;
      romScore = 95 + offset;
      growScore = 95 + offset;
      dailyScore = 93 + offset;
      confScore = 15 - offset;
    }

    archetypeTitle = 'Llamas Gemelas Predestinadas';

    dimensions = dimensions.map((dim) => {
      switch (dim.id) {
        case 'communication':
          return {
            ...dim,
            name: 'Comunión Intelectual & Mente',
            score: Math.min(99, commScore),
            level: 'Excepcional & Telepática',
            summary: 'Sincronía cognitiva profunda, diálogo inagotable y comprensión mutua que trasciende cualquier distancia.',
            positiveFactors: [
              'Conexión mental ágil, abierta y sin barreras culturales',
              'Humor cómplice compartido y fascinación intelectual mutua',
            ],
          };
        case 'stability':
          return {
            ...dim,
            name: 'Compromiso, Lealtad & Tiempo (Saturno)',
            score: Math.min(96, stabScore),
            level: 'Inquebrantable & Sólida',
            summary: 'Estructura saturnina madura para perdurar a través del tiempo con lealtad y devoción consciente.',
            positiveFactors: [
              'Pacto de lealtad sincero y voluntad mutua de permanencia',
              'Capacidad de salvar distancias y edificar proyectos de vida duraderos',
            ],
          };
        case 'emotional':
          return {
            ...dim,
            name: 'Conexión Emocional & Cobijo',
            score: Math.min(98, emoScore),
            level: 'Profunda & Sagrada',
            summary: 'Cobijo anímico sincero; un espacio de intimidad y ternura donde toda vulnerabilidad es acogida.',
            positiveFactors: [
              'Fusión armónica de agua profunda y fuego generoso',
              'Seguridad emocional y confianza mutua',
            ],
          };
        case 'attraction':
          return {
            ...dim,
            name: 'Atracción & Magnetismo',
            score: Math.min(97, attrScore),
            level: 'Magnética & Fascinante',
            summary: 'Chispa erótica viva y polaridad física que se renueva y madura con el tiempo.',
            positiveFactors: [
              'Atracción de polaridades cósmicas complementarias',
              'Química electromagnética constante',
            ],
          };
        case 'intensity':
          return {
            ...dim,
            name: 'Intensidad & Profundidad',
            score: Math.min(98, intScore),
            level: 'Transformadora & Evolutiva',
            summary: 'Impacto espiritual profundo que despierta la versión más consciente de cada alma.',
            positiveFactors: [
              'Despertar mutuo de propósito y crecimiento personal',
              'Vínculo de llamas gemelas para evolucionar juntos',
            ],
          };
        case 'romance':
          return {
            ...dim,
            name: 'Romanticismo & Ternura',
            score: Math.min(96, romScore),
            level: 'Cálida & Devocional',
            summary: 'Dulzura sincera, admiración recíproca y detalles afectivos que enriquecen el corazón.',
            positiveFactors: [
              'Admiración sincera por la esencia del otro',
              'Ternura y reverencia afectiva continua',
            ],
          };
        case 'growth':
          return {
            ...dim,
            name: 'Crecimiento Mutuo',
            score: Math.min(97, growScore),
            level: 'Excepcional & Expansiva',
            summary: 'Inspiración mutua que amplía horizontes, rompe fronteras y multiplica la abundancia.',
            positiveFactors: [
              'Impulso mutuo hacia la superación personal',
              'Apertura cultural y enriquecimiento de mundos',
            ],
          };
        case 'daily':
          return {
            ...dim,
            name: 'Compatibilidad Cotidiana',
            score: Math.min(93, dailyScore),
            level: 'Armoniosa & Adaptativa',
            summary: 'Convivencia armónica donde cada uno aprende a integrar las costumbres y ritmos del otro con generosidad.',
            positiveFactors: [
              'Capacidad de adaptación y respeto mutuo',
              'Apoyo incondicional en las tareas de la vida terrenal',
            ],
          };
        case 'conflict':
          return {
            ...dim,
            name: 'Tensión / Desafío Constructivo',
            score: Math.max(12, confScore),
            level: 'Fricción Moderada & Superable',
            summary: 'Roces menores vinculados a diferentes contextos o distancias geográficas, fácilmente superables con diálogo maduro.',
            positiveFactors: [
              'Capacidad de resolver diferencias desde el amor',
              'Comprensión mutua ante puntos de vista diversos',
            ],
            challengeFactors: ['Adaptación a diferentes entornos o tiempos de vida'],
          };
        default:
          return dim;
      }
    });
  } else {
    // Cálculo general estándar
    const nonConflictDims = dimensions.filter((d) => d.id !== 'conflict');
    const sumScores = nonConflictDims.reduce((acc, curr) => acc + curr.score, 0);
    averageScore = Math.round(sumScores / nonConflictDims.length);

    const conflictDim = dimensions.find((d) => d.id === 'conflict');
    const conflictScore = conflictDim ? conflictDim.score : 40;
    harmonyIndex = Math.max(10, Math.min(100, Math.round(averageScore - conflictScore * 0.25)));

    archetypeTitle = 'Alquimia en Desarrollo';
    if (averageScore >= 78 && conflictScore < 45) {
      archetypeTitle = 'Resonancia Magnética y Refugio Álmico';
    } else if (averageScore >= 75 && conflictScore >= 45) {
      archetypeTitle = 'Pasión Transformadora y Fuego Evolutivo';
    } else if (averageScore >= 65) {
      archetypeTitle = 'Complementariedad Creativa y Diálogo Profundo';
    } else {
      archetypeTitle = 'Espejo de Aprendizaje y Maduración Mutua';
    }
  }

  return {
    personA: chartA.profile,
    personB: chartB.profile,
    aspects,
    overlaysAInB,
    overlaysBInA,
    dimensions,
    overallCompatibility: {
      averageScore,
      harmonyIndex,
      archetypeTitle,
    },
  };
}
