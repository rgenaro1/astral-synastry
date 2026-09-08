import { NatalChart, SynastryAnalysis } from '../types/astrology';
import { calculateInterChartAspects } from './interAspects';
import { calculateHouseOverlays } from './houseOverlays';
import { calculateCompatibilityDimensions } from './compatibilityScores';

export function calculateSynastry(
  chartA: NatalChart,
  chartB: NatalChart
): SynastryAnalysis {
  // 1. Aspectos inter-cartas
  const aspects = calculateInterChartAspects(chartA, chartB);

  // 2. Superposición de casas (Planetas de A en casas de B y viceversa)
  const overlaysAInB = calculateHouseOverlays(chartA, chartB, 'personA', 'personB');
  const overlaysBInA = calculateHouseOverlays(chartB, chartA, 'personB', 'personA');

  // 3. Puntuaciones multidimensionales (9 dimensiones matemáticas)
  const dimensions = calculateCompatibilityDimensions(
    aspects,
    overlaysAInB,
    overlaysBInA,
    chartA,
    chartB
  );

  // 4. Promedio general y título arquetípico
  const nonConflictDims = dimensions.filter((d) => d.id !== 'conflict');
  const sumScores = nonConflictDims.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = Math.round(sumScores / nonConflictDims.length);

  const conflictDim = dimensions.find((d) => d.id === 'conflict');
  const conflictScore = conflictDim ? conflictDim.score : 40;
  const harmonyIndex = Math.max(10, Math.min(100, Math.round(averageScore - conflictScore * 0.25)));

  let archetypeTitle = 'Alquimia en Desarrollo';
  if (averageScore >= 78 && conflictScore < 45) {
    archetypeTitle = 'Resonancia Magnética y Refugio Álmico';
  } else if (averageScore >= 75 && conflictScore >= 45) {
    archetypeTitle = 'Pasión Transformadora y Fuego Evolutivo';
  } else if (averageScore >= 65) {
    archetypeTitle = 'Complementariedad Creativa y Diálogo Profundo';
  } else {
    archetypeTitle = 'Espejo de Aprendizaje y Maduración Mutua';
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
