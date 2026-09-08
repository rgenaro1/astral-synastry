import { resolveHistoricDateTime } from '../lib/geo/timezone';
import { calculateNatalChart } from '../lib/astronomy/chart';
import { calculateSynastry } from '../lib/synastry/engine';
import { calculateCompositeChart, calculateMidpoint } from '../lib/composite/engine';
import { angularDistance, normalize360 } from '../lib/astronomy/coordinates';

async function runTests() {
  console.log('--- INICIANDO BATERÍA DE PRUEBAS ASTROLÓGICAS Y DE SINASTRÍA ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Prueba de normalización de ángulos y distancia angular
  assert(normalize360(-30) === 330, 'Normalización ángulo negativo (-30 -> 330)');
  assert(normalize360(390) === 30, 'Normalización ángulo excedente (390 -> 30)');
  assert(angularDistance(10, 350) === 20, 'Distancia angular a través de 0° (10 a 350 es 20°)');
  assert(angularDistance(10, 190) === 180, 'Distancia angular oposición exacta (10 a 190 es 180°)');

  // 2. Prueba de cálculo de puntos medios (Arco menor)
  assert(calculateMidpoint(10, 30) === 20, 'Punto medio simple (10 y 30 es 20°)');
  assert(calculateMidpoint(350, 10) === 0, 'Punto medio cruzando 0° (350 y 10 es 0°)');
  assert(calculateMidpoint(10, 350) === 0, 'Punto medio simétrico (10 y 350 es 0°)');

  // 3. Prueba de zona horaria y horario de verano histórico
  const historicalDstPeru = resolveHistoricDateTime({
    name: 'Test DST',
    birthDate: '1990-02-14',
    birthTime: '12:00',
    city: 'Trujillo',
    country: 'Perú',
    latitude: -8.1116,
    longitude: -79.0286,
    timezoneIana: 'America/Lima',
  });
  assert(
    historicalDstPeru.utcOffsetMinutes === -240,
    'Resolución histórica de horario de verano en Perú (Feb 1990 = GMT-4)'
  );

  const historicalNormalPeru = resolveHistoricDateTime({
    name: 'Test Normal',
    birthDate: '1990-05-14',
    birthTime: '12:00',
    city: 'Trujillo',
    country: 'Perú',
    latitude: -8.1116,
    longitude: -79.0286,
    timezoneIana: 'America/Lima',
  });
  assert(
    historicalNormalPeru.utcOffsetMinutes === -300,
    'Resolución histórica normal en Perú (May 1990 = GMT-5)'
  );

  // 4. Prueba de Carta Natal Determinista
  const chartA = calculateNatalChart({
    name: 'Persona A',
    birthDate: '1990-01-01',
    birthTime: '12:00',
    city: 'Londres',
    country: 'UK',
    latitude: 51.5074,
    longitude: -0.1278,
    timezoneIana: 'Europe/London',
  });

  assert(chartA.planets.length === 13, 'Cálculo de 13 cuerpos celestes (Sol a Plutón + Nodos + Quirón)');
  const sun = chartA.planets.find((p) => p.id === 'sun');
  assert(sun?.sign === 'Capricorn', 'Sol el 1 de enero debe estar en Capricornio');
  assert(chartA.houses.length === 12, 'Cálculo de 12 casas astrológicas');
  assert(chartA.aspects.length > 0, 'Detección de aspectos internos');

  // 5. Prueba de Sinastría y Compatibilidad
  const chartB = calculateNatalChart({
    name: 'Persona B',
    birthDate: '1992-06-15',
    birthTime: '06:30',
    city: 'Nueva York',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.006,
    timezoneIana: 'America/New_York',
  });

  const synastry = calculateSynastry(chartA, chartB);
  assert(synastry.aspects.length > 0, 'Detección de aspectos inter-cartas');
  assert(synastry.overlaysAInB.length === 13, 'Superposición de 13 planetas de A en casas de B');
  assert(synastry.overlaysBInA.length === 13, 'Superposición de 13 planetas de B en casas de A');
  assert(synastry.dimensions.length === 9, 'Cálculo de 9 dimensiones cuantitativas de compatibilidad');
  assert(
    synastry.dimensions.every((d) => d.score >= 10 && d.score <= 100),
    'Puntuaciones normalizadas en rango [10, 100]'
  );

  // 6. Prueba de Carta Compuesta
  const composite = calculateCompositeChart(chartA, chartB);
  assert(composite.planets.length === 13, '13 planetas compuestos calculados');
  assert(composite.houses.length === 12, '12 casas compuestas calculadas');
  assert(composite.aspects.length > 0, 'Aspectos internos en carta compuesta');

  console.log(`\nRESUMEN DE PRUEBAS: ${passed} pasadas, ${failed} falladas.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
