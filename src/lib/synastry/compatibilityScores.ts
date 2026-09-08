import {
  CompatibilityDimension,
  HouseOverlay,
  InterChartAspect,
  NatalChart,
} from '../types/astrology';

function clampScore(val: number): number {
  return Math.max(12, Math.min(96, Math.round(val)));
}

function getQualitativeLevel(score: number, isConflictDim = false): string {
  if (isConflictDim) {
    if (score >= 75) return 'Tensión Elevada (Requiere Madurez)';
    if (score >= 50) return 'Fricción Dinámica Estimulante';
    return 'Baja Fricción (Convivencia Serena)';
  }

  if (score >= 85) return 'Excepcional & Profunda';
  if (score >= 72) return 'Muy Fluida & Armoniosa';
  if (score >= 58) return 'Fértil & Equilibrada';
  if (score >= 42) return 'En Desarrollo (Requiere Esfuerzo)';
  return 'Desafiante (Divergencia Arquetípica)';
}

export function calculateCompatibilityDimensions(
  aspects: InterChartAspect[],
  overlaysAInB: HouseOverlay[],
  overlaysBInA: HouseOverlay[],
  chartA: NatalChart,
  chartB: NatalChart
): CompatibilityDimension[] {
  // 1. CONEXIÓN EMOCIONAL (Luna - Sol, Luna - Luna, Luna - Venus, Casa 4)
  let emotionalScore = 52;
  const emoPositives: string[] = [];
  const emoChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (pair.includes('moon')) {
      if (a.nature === 'harmonious' || (a.type === 'conjunction' && !pair.includes('saturn'))) {
        const bonus = (a.strength / 100) * 14;
        emotionalScore += bonus;
        emoPositives.push(`${a.typeName} de ${a.planet1Name} y ${a.planet2Name} (${a.strength}% fuerza)`);
      } else if (a.nature === 'challenging') {
        const penalty = (a.strength / 100) * 10;
        emotionalScore -= penalty;
        emoChallenges.push(`${a.typeName} de ${a.planet1Name} y ${a.planet2Name}`);
      }
    }
  }
  // Revisar overlays de la Luna en casa 4 o 7
  const moonIn4or7 = [...overlaysAInB, ...overlaysBInA].filter(
    (o) => o.planet === 'moon' && (o.fallsInHouseOfOther === 4 || o.fallsInHouseOfOther === 7)
  );
  if (moonIn4or7.length > 0) {
    emotionalScore += 8;
    emoPositives.push('Superposición lunar en casa de intimidad o compromiso (Casa 4/7)');
  }
  const finalEmotional = clampScore(emotionalScore);

  // 2. COMUNICACIÓN (Mercurio con Mercurio, Luna, Sol, Júpiter, Casa 3)
  let commScore = 50;
  const commPositives: string[] = [];
  const commChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (pair.includes('mercury')) {
      if (a.nature === 'harmonious' || (a.type === 'conjunction' && !pair.includes('mars'))) {
        commScore += (a.strength / 100) * 13;
        commPositives.push(`${a.typeName} entre ${a.planet1Name} y ${a.planet2Name}`);
      } else if (a.nature === 'challenging') {
        commScore -= (a.strength / 100) * 9;
        commChallenges.push(`Tensión en ${a.typeName} de ${a.planet1Name} y ${a.planet2Name}`);
      }
    }
  }
  const finalComm = clampScore(commScore);

  // 3. ATRACCIÓN & QUÍMICA (Venus - Marte, Marte - Marte, Venus - Plutón, Marte - Plutón, Casa 8)
  let attrScore = 48;
  const attrPositives: string[] = [];
  const attrChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (
      pair === 'mars_venus' ||
      pair === 'mars_mars' ||
      pair === 'pluto_venus' ||
      pair === 'mars_pluto' ||
      pair === 'mars_sun'
    ) {
      if (a.type === 'conjunction' || a.nature === 'harmonious' || a.type === 'opposition') {
        // En atracción, la oposición y cuadratura también generan alta chispa aunque con tensión
        const bonus = (a.strength / 100) * 16;
        attrScore += bonus;
        attrPositives.push(`Contacto magnético ${a.typeName} ${a.planet1Name}-${a.planet2Name}`);
      } else if (a.type === 'square') {
        attrScore += (a.strength / 100) * 8;
        attrChallenges.push(`Fricción pasional por cuadratura ${a.planet1Name}-${a.planet2Name}`);
      }
    }
  }
  const house8Overlays = [...overlaysAInB, ...overlaysBInA].filter(
    (o) => (o.planet === 'venus' || o.planet === 'mars') && o.fallsInHouseOfOther === 8
  );
  if (house8Overlays.length > 0) {
    attrScore += 10;
    attrPositives.push('Presencia de Venus o Marte en la Casa 8 del otro (magnetismo erótico íntimo)');
  }
  const finalAttr = clampScore(attrScore);

  // 4. ROMANTICISMO (Venus con Sol, Luna, Venus, Júpiter, Casa 5 y 7)
  let romScore = 52;
  const romPositives: string[] = [];
  const romChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (pair === 'sun_venus' || pair === 'venus_venus' || pair === 'jupiter_venus' || pair === 'neptune_venus') {
      if (a.nature === 'harmonious' || a.type === 'conjunction') {
        romScore += (a.strength / 100) * 14;
        romPositives.push(`Resonancia romántica: ${a.typeName} de ${a.planet1Name} y ${a.planet2Name}`);
      } else if (a.nature === 'challenging') {
        romScore -= (a.strength / 100) * 8;
        romChallenges.push(`Expectativas divergentes en ${a.typeName} ${a.planet1Name}-${a.planet2Name}`);
      }
    }
  }
  const finalRom = clampScore(romScore);

  // 5. ESTABILIDAD & COMPROMISO (Saturno con planetas personales, Casa 7)
  let stabScore = 50;
  const stabPositives: string[] = [];
  const stabChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (pair.includes('saturn') && (pair.includes('sun') || pair.includes('moon') || pair.includes('venus'))) {
      if (a.nature === 'harmonious' || a.type === 'conjunction') {
        stabScore += (a.strength / 100) * 15;
        stabPositives.push(`Estructura y fidelidad por ${a.typeName} Saturno con ${a.planet2Name === 'Saturno' ? a.planet1Name : a.planet2Name}`);
      } else if (a.nature === 'challenging') {
        stabScore -= (a.strength / 100) * 9;
        stabChallenges.push(`Sensación de exigencia o frialdad por ${a.typeName} de Saturno`);
      }
    }
  }
  const finalStab = clampScore(stabScore);

  // 6. INTENSIDAD & PROFUNDIDAD (Plutón, Nodos, Quirón, Casa 8 y 12)
  let intScore = 46;
  const intPositives: string[] = [];
  const intChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (pair.includes('pluto') || pair.includes('north_node') || pair.includes('chiron')) {
      intScore += (a.strength / 100) * 11;
      intPositives.push(`Vínculo evolutivo: ${a.typeName} con ${pair.includes('pluto') ? 'Plutón' : 'Eje Nodal'}`);
      if (a.nature === 'challenging') {
        intChallenges.push(`Poder y control inconsciente en ${a.typeName}`);
      }
    }
  }
  const finalInt = clampScore(intScore);

  // 7. CONFLICTO & DESAFÍO CONSTRUCTIVO (Cuadraturas y oposiciones tensas)
  let confScore = 32;
  const confPositives: string[] = [];
  const confChallenges: string[] = [];

  for (const a of aspects) {
    if (a.nature === 'challenging') {
      confScore += (a.strength / 100) * 9;
      confChallenges.push(`Tensión activa en ${a.typeName} ${a.planet1Name}-${a.planet2Name}`);
    }
  }
  if (confScore < 40) {
    confPositives.push('Pocos aspectos de confrontación directa: convivencia predominantemente pacífica');
  } else {
    confPositives.push('Tensión que estimula el cambio y evita el estancamiento relacional');
  }
  const finalConf = clampScore(confScore);

  // 8. CRECIMIENTO MUTUO (Júpiter y Nodo Norte)
  let growScore = 52;
  const growPositives: string[] = [];
  const growChallenges: string[] = [];

  for (const a of aspects) {
    const pair = [a.person1Planet, a.person2Planet].sort().join('_');
    if (pair.includes('jupiter') || pair.includes('north_node')) {
      if (a.nature === 'harmonious' || a.type === 'conjunction') {
        growScore += (a.strength / 100) * 13;
        growPositives.push(`Expansión compartida: ${a.typeName} ${a.planet1Name}-${a.planet2Name}`);
      }
    }
  }
  const finalGrow = clampScore(growScore);

  // 9. COMPATIBILIDAD COTIDIANA (Mercurio, Luna, Casa 6, afinidad de elementos)
  let dailyScore = 50;
  const dailyPositives: string[] = [];
  const dailyChallenges: string[] = [];

  // Afinidad elemental entre Soles y Lunas
  const sunA = chartA.planets.find((p) => p.id === 'sun')!;
  const sunB = chartB.planets.find((p) => p.id === 'sun')!;
  const moonA = chartA.planets.find((p) => p.id === 'moon')!;
  const moonB = chartB.planets.find((p) => p.id === 'moon')!;

  if (sunA && sunB && chartA.elements.dominantElement === chartB.elements.dominantElement) {
    dailyScore += 10;
    dailyPositives.push(`Afinidad natural del elemento dominante (${chartA.elements.dominantElement})`);
  }
  if (moonA && moonB) {
    const diff = Math.abs(moonA.longitude - moonB.longitude);
    if (diff < 15 || (diff > 105 && diff < 135)) {
      dailyScore += 10;
      dailyPositives.push('Sintonía intuitiva en hábitos y ritmos de descanso lunar');
    }
  }
  const finalDaily = clampScore(dailyScore);

  return [
    {
      id: 'emotional',
      name: 'Conexión Emocional',
      score: finalEmotional,
      level: getQualitativeLevel(finalEmotional),
      summary: 'Capacidad de cobijar los estados anímicos del otro, empatía intuitiva y contención íntima.',
      positiveFactors: emoPositives.length ? emoPositives : ['Aceptación afectiva serena'],
      challengeFactors: emoChallenges.length ? emoChallenges : ['Fluctuaciones anímicas menores'],
    },
    {
      id: 'communication',
      name: 'Comunicación & Entendimiento',
      score: finalComm,
      level: getQualitativeLevel(finalComm),
      summary: 'Fluidez verbal, velocidad de comprensión compartida y resolución pacífica de diferencias.',
      positiveFactors: commPositives.length ? commPositives : ['Diálogo respetuoso'],
      challengeFactors: commChallenges.length ? commChallenges : ['Interpretaciones diversas'],
    },
    {
      id: 'attraction',
      name: 'Atracción & Magnetismo',
      score: finalAttr,
      level: getQualitativeLevel(finalAttr),
      summary: 'Chispa erótica, polaridad física, magnetismo animal y juego de seducción.',
      positiveFactors: attrPositives.length ? attrPositives : ['Atracción suave'],
      challengeFactors: attrChallenges.length ? attrChallenges : ['Diferentes ritmos en el deseo'],
    },
    {
      id: 'romance',
      name: 'Romanticismo & Ternura',
      score: finalRom,
      level: getQualitativeLevel(finalRom),
      summary: 'Capacidad de endulzar la relación, detalles afectivos, admiración y poesía vincular.',
      positiveFactors: romPositives.length ? romPositives : ['Cariño mutuo genuino'],
      challengeFactors: romChallenges.length ? romChallenges : ['Expresiones de amor asimétricas'],
    },
    {
      id: 'stability',
      name: 'Estabilidad & Compromiso',
      score: finalStab,
      level: getQualitativeLevel(finalStab),
      summary: 'Habilidad de edificar a largo plazo, lealtad en momentos difíciles y solidez estructural.',
      positiveFactors: stabPositives.length ? stabPositives : ['Voluntad de permanencia'],
      challengeFactors: stabChallenges.length ? stabChallenges : ['Temor al exceso de responsabilidad'],
    },
    {
      id: 'intensity',
      name: 'Intensidad & Profundidad',
      score: finalInt,
      level: getQualitativeLevel(finalInt),
      summary: 'Impacto transformador que este vínculo genera en el alma y el destino de cada uno.',
      positiveFactors: intPositives.length ? intPositives : ['Calamidad o lección kármica compartida'],
      challengeFactors: intChallenges.length ? intChallenges : ['Resistencia a soltar el control'],
    },
    {
      id: 'conflict',
      name: 'Tensión / Desafío Constructivo',
      score: finalConf,
      level: getQualitativeLevel(finalConf, true),
      summary: 'Nivel de fricción interna y confrontación entre los egos de ambas personas.',
      positiveFactors: confPositives.length ? confPositives : ['Pocos roces frontales'],
      challengeFactors: confChallenges.length ? confChallenges : ['Choques periódicos de temperamento'],
    },
    {
      id: 'growth',
      name: 'Crecimiento Mutuo',
      score: finalGrow,
      level: getQualitativeLevel(finalGrow),
      summary: 'Inspiración para ampliar la mente, generar abundancia y superarse personalmente.',
      positiveFactors: growPositives.length ? growPositives : ['Motivación mutua'],
      challengeFactors: growChallenges.length ? growChallenges : ['Divergencia en prioridades de vida'],
    },
    {
      id: 'daily',
      name: 'Compatibilidad Cotidiana',
      score: finalDaily,
      level: getQualitativeLevel(finalDaily),
      summary: 'Facilidad de convivencia en el espacio compartido, horarios, economía doméstica y tareas.',
      positiveFactors: dailyPositives.length ? dailyPositives : ['Respeto por los espacios personales'],
      challengeFactors: dailyChallenges.length ? dailyChallenges : ['Manías y ritmos diarios dispares'],
    },
  ];
}
