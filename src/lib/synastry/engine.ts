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
    // Calculamos micro-variaciones sutiles y deterministas entre 96% y 98% según:
    // - Hora exacta de nacimiento (que mueve el Ascendente 1° cada 4 min y la Luna)
    // - Coordenadas geográficas (latitud y longitud de nacimiento)
    const moonA = chartA.planets.find((p) => p.id === 'moon')?.longitude || 0;
    const moonB = chartB.planets.find((p) => p.id === 'moon')?.longitude || 0;
    const ascA = chartA.angles?.ascendant?.longitude || 0;
    const ascB = chartB.angles?.ascendant?.longitude || 0;

    // Resonancia armónica de ángulos (entre -1 y +1)
    const moonDiff = Math.abs(moonA - moonB);
    const ascDiff = Math.abs(ascA - ascB);
    const geoHarmonic = Math.sin(((chartA.profile.latitude + chartB.profile.longitude) * Math.PI) / 90);
    
    const timeHarmony =
      Math.cos((moonDiff * Math.PI) / 60) * 0.4 +
      Math.cos((ascDiff * Math.PI) / 60) * 0.4 +
      geoHarmonic * 0.2;

    // Offset armónico entre 0, 1 y 2:
    // timeHarmony < -0.1 => 96%
    // -0.1 <= timeHarmony < 0.4 => 97%
    // timeHarmony >= 0.4 => 98%
    let offset = 2; // Por defecto 98%
    if (timeHarmony < -0.1) {
      offset = 0; // 96%
    } else if (timeHarmony < 0.4) {
      offset = 1; // 97%
    } else {
      offset = 2; // 98%
    }

    averageScore = 96 + offset; // Resulta en 96%, 97% o 98%
    harmonyIndex = averageScore;
    archetypeTitle = 'Llamas Gemelas Predestinadas';

    // Dimensiones con ligeras variaciones coordinadas según la hora y el lugar:
    const commScore = 97 + offset; // 97%, 98% o 99% (promedio solicitado: 99%)
    const stabScore = 95 + (offset >= 1 ? 1 : 0) + (offset === 2 ? 0 : 0); // 95% o 96% (solicitado: 96%)
    const emoScore = 97 + offset; // 97%, 98% o 99%
    const attrScore = 96 + offset; // 96%, 97% o 98%
    const intScore = 97 + offset; // 97%, 98% o 99%
    const romScore = 96 + offset; // 96%, 97% o 98%
    const growScore = 96 + offset; // 96%, 97% o 98%
    const dailyScore = 94 + offset; // 94%, 95% o 96%
    const confScore = 14 - offset; // 14%, 13% o 12%

    dimensions = dimensions.map((dim) => {
      switch (dim.id) {
        case 'communication':
          return {
            ...dim,
            name: 'Comunión Intelectual & Mente',
            score: Math.min(99, commScore),
            level: 'Excepcional & Telepática',
            summary: 'Sincronía cognitiva sublime, diálogo inagotable y comprensión mutua sin necesidad de palabras.',
            positiveFactors: [
              'Conexión mental prácticamente telepática y agudeza verbal asombrosa',
              'Humor cómplice compartido y fascinación intelectual inagotable',
            ],
          };
        case 'stability':
          return {
            ...dim,
            name: 'Compromiso, Lealtad & Tiempo (Saturno)',
            score: Math.min(97, stabScore >= 95 ? 96 : 95),
            level: 'Inquebrantable & Eterna',
            summary: 'Estructura saturnina bendecida para perdurar a través de los años con lealtad incondicional y devoción sólida.',
            positiveFactors: [
              'Pacto de lealtad indestructible y protección recíproca absoluta',
              'Madurez serena para edificar proyectos y una vida compartida sin vacilaciones',
            ],
          };
        case 'emotional':
          return {
            ...dim,
            name: 'Conexión Emocional & Cobijo',
            score: Math.min(99, emoScore),
            level: 'Excepcional & Sagrada',
            summary: 'Cobijo anímico total; un santuario de intimidad y ternura donde toda vulnerabilidad es abrazada con reverencia.',
            positiveFactors: [
              'Fusión armónica del agua profunda y el fuego protector',
              'Seguridad emocional total y confianza instintiva inmediata',
            ],
          };
        case 'attraction':
          return {
            ...dim,
            name: 'Atracción & Magnetismo',
            score: Math.min(98, attrScore),
            level: 'Magnética & Arrebatadora',
            summary: 'Chispa erótica fascinante y polaridad física inextinguible que madura en sofisticación sensual con el paso del tiempo.',
            positiveFactors: [
              'Atracción cósmica de polaridades sagradas complementarias',
              'Química electromagnética viva y constante',
            ],
          };
        case 'intensity':
          return {
            ...dim,
            name: 'Intensidad & Profundidad',
            score: Math.min(99, intScore),
            level: 'Transformadora & Sagrada',
            summary: 'El impacto espiritual más hondo que dos almas pueden experimentar, despertando su versión más luminosa.',
            positiveFactors: [
              'Despertar mutuo de propósito y sanación de memorias kármicas',
              'Pacto evolutivo de llamas gemelas para trascender juntos',
            ],
          };
        case 'romance':
          return {
            ...dim,
            name: 'Romanticismo & Ternura',
            score: Math.min(98, romScore),
            level: 'Poética & Devocional',
            summary: 'Dulzura inagotable, admiración recíproca y la gracia de convertir cada día compartido en poesía viva.',
            positiveFactors: [
              'Reverencia y admiración sincera por el alma del otro',
              'Detalles afectivos constantes que enriquecen el corazón',
            ],
          };
        case 'growth':
          return {
            ...dim,
            name: 'Crecimiento Mutuo',
            score: Math.min(98, growScore),
            level: 'Excepcional & Expansiva',
            summary: 'Inspiración continua que ensancha la visión del mundo, atrae abundancia y da alas a cada sueño compartido.',
            positiveFactors: [
              'Impulso mutuo hacia la grandeza personal y conjunta',
              'Optimismo jupiteriano y fe compartida en el porvenir',
            ],
          };
        case 'daily':
          return {
            ...dim,
            name: 'Compatibilidad Cotidiana',
            score: Math.min(96, dailyScore),
            level: 'Fluida & Serena',
            summary: 'Convivencia armónica y respetuosa donde cada uno tiene su espacio vital en perfecta sintonía.',
            positiveFactors: [
              'Ritmo cotidiano apacible y generosidad en los detalles diarios',
              'Apoyo incondicional en las tareas de la vida terrenal',
            ],
          };
        case 'conflict':
          return {
            ...dim,
            name: 'Tensión / Desafío Constructivo',
            score: Math.max(11, confScore),
            level: 'Fricción Mínima (Armonía Pura)',
            summary: 'Tensión mínima y exclusivamente constructiva; cualquier discrepancia se disuelve en minutos desde la compasión y el amor.',
            positiveFactors: [
              'Capacidad inmediata de pedir perdón y comprender al otro con ternura',
              'Disolución espontánea del ego en favor de la unión sagrada',
            ],
            challengeFactors: [],
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
