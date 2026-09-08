import { HouseOverlay, NatalChart, PlanetId } from '../types/astrology';
import { getHouseForLongitude } from '../astronomy/houses';

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Impacto directo en la identidad, presencia física y vitalidad del otro.',
  2: 'Influencia en los recursos, seguridad material, autoestima y valores compartidos.',
  3: 'Dinamismo en la comunicación diaria, conversaciones estimulantes y entorno mental.',
  4: 'Conexión profunda con las raíces, hogar, privacidad y sensación de refugio íntimo.',
  5: 'Chispa de romance, juego creativo, disfrute lúdico y expresión afectiva.',
  6: 'Rutina cotidiana, soporte mutuo en el día a día y hábitos compartidos.',
  7: 'Proyección del ideal de pareja, compromiso formal y espejo vincular.',
  8: 'Magnetismo transformador, intimidad sexual profunda y unión emocional visceral.',
  9: 'Expansión de horizontes, viajes filosóficos, crecimiento espiritual y visión del mundo.',
  10: 'Proyección pública, apoyo en metas profesionales y estatus compartido.',
  11: 'Amistad sincera, complicidad en proyectos a futuro e ideales compartidos.',
  12: 'Conexión kármica, empatía intuitiva silenciosa y vulnerabilidad inconsciente.',
};

/**
 * Calcula las superposiciones de casas (en qué casa del otro cae cada planeta)
 */
export function calculateHouseOverlays(
  sourceChart: NatalChart,
  targetChart: NatalChart,
  sourceOwner: 'personA' | 'personB',
  targetOwner: 'personA' | 'personB'
): HouseOverlay[] {
  return sourceChart.planets.map((planet) => {
    const houseNumber = getHouseForLongitude(planet.longitude, targetChart.houses);
    const significance = `${planet.name} en Casa ${houseNumber}: ${HOUSE_MEANINGS[houseNumber] || 'Interacción energética notable.'}`;

    return {
      planet: planet.id,
      planetName: planet.name,
      planetOwner: sourceOwner,
      fallsInHouseOfOther: houseNumber,
      houseOwner: targetOwner,
      sign: planet.sign,
      degree: planet.signDegree,
      significance,
    };
  });
}
