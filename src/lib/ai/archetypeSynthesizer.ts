import { SynastryContextDigest } from './contextSerializer';
import { isTwinFlamePair } from '../synastry/engine';

// Helper para clasificar signo en su elemento
export function getElementOfSign(signName: string): 'Fuego' | 'Tierra' | 'Aire' | 'Agua' {
  const s = (signName || '').toLowerCase();
  if (s.includes('aries') || s.includes('leo') || s.includes('sagitario') || s.includes('sagittarius')) return 'Fuego';
  if (s.includes('tauro') || s.includes('taurus') || s.includes('virgo') || s.includes('capricornio') || s.includes('capricorn')) return 'Tierra';
  if (s.includes('géminis') || s.includes('gemini') || s.includes('libra') || s.includes('acuario') || s.includes('aquarius')) return 'Aire';
  return 'Agua'; // Cáncer, Escorpio, Piscis
}

/**
 * Genera un Contrato Evolutivo único y dinámico según los elementos y casas de la pareja
 */
export function generateDynamicSoulContract(digest: SynastryContextDigest): string {
  const { personA, personB, keyHouseOverlays, overall } = digest;
  const isTwin = overall.archetypeTitle.includes('Llamas Gemelas') || isTwinFlamePair(personA.birthInfo, personB.birthInfo);

  if (isTwin) {
    return `En el plano del contrato anímico, este vínculo encarna el pacto sagrado de las Llamas Gemelas: una cita acordada antes del nacimiento para recordar quiénes son en su más alta pureza. ${personB.name} aporta la sabiduría expansiva, la fe inquebrantable y el impulso protector que permite a ${personA.name} desarmar sus corazas más antiguas sin miedo; mientras que la mirada magnética, intuitiva y leal de ${personA.name} ofrece a ${personB.name} un santuario de verdad visceral donde descansar de las batallas del mundo y ser amado/a en su totalidad.`;
  }

  const elemA = getElementOfSign(personA.sun.sign);
  const elemB = getElementOfSign(personB.sun.sign);
  const pair = [elemA, elemB].sort().join('-');

  let elementalText = '';

  switch (pair) {
    case 'Agua-Fuego':
      elementalText = `El contrato evolutivo entre ${personA.name} (${personA.sun.sign}, ${elemA}) y ${personB.name} (${personB.sun.sign}, ${elemB}) propone una poderosa alquimia de Agua y Fuego: el misterio donde la emoción profunda aprende a confiar en la luz del entusiasmo. ${elemA === 'Agua' ? personA.name : personB.name} custodia la memoria sensible y la intuición del vínculo, enseñando al otro la belleza de la vulnerabilidad sin máscaras; mientras que ${elemA === 'Fuego' ? personA.name : personB.name} insufla coraje, nobleza y optimismo vital para disolver cualquier sombra o temor al abandono.`;
      break;
    case 'Agua-Tierra':
      elementalText = `El contrato anímico entre ${personA.name} (${personA.sun.sign}, ${elemA}) y ${personB.name} (${personB.sun.sign}, ${elemB}) responde a la fructífera alianza del Agua y la Tierra: la creación de un oasis fértil. ${elemA === 'Tierra' ? personA.name : personB.name} ofrece a la relación un suelo firme, constancia tangible y un arraigo sereno; mientras que ${elemA === 'Agua' ? personA.name : personB.name} riega esa tierra con empatía, poesía y una ternura íntima que ablanda cualquier rigidez pragmática.`;
      break;
    case 'Aire-Fuego':
      elementalText = `El contrato álmico de ${personA.name} (${personA.sun.sign}, ${elemA}) y ${personB.name} (${personB.sun.sign}, ${elemB}) es la chispa que enciende el viento: un pacto contra la monotonía y la resignación. ${elemA === 'Aire' ? personA.name : personB.name} estimula la mente de ${elemA === 'Fuego' ? personA.name : personB.name} con visiones brillantes, libertad y ligereza; mientras que ${elemA === 'Fuego' ? personA.name : personB.name} aporta la pasión arrebatadora, la generosidad de espíritu y el impulso para materializar juntos sus ideales más audaces.`;
      break;
    case 'Aire-Tierra':
      elementalText = `El contrato de evolución de ${personA.name} (${personA.sun.sign}, ${elemA}) y ${personB.name} (${personB.sun.sign}, ${elemB}) es la arquitectura entre la idea y la materia. ${elemA === 'Aire' ? personA.name : personB.name} aporta perspectiva conceptual, ingenio comunicativo y apertura social; mientras que ${elemA === 'Tierra' ? personA.name : personB.name} le entrega realismo, fidelidad perseverante y la disciplina amorosa necesaria para edificar un futuro seguro.`;
      break;
    case 'Agua-Aire':
      elementalText = `El contrato entre ${personA.name} (${personA.sun.sign}, ${elemA}) y ${personB.name} (${personB.sun.sign}, ${elemB}) convoca el diálogo entre el sentir oceánico y la mente lúcida. ${elemA === 'Aire' ? personA.name : personB.name} enseña a no ahogarse en los vaivenes emocionales, brindando aire fresco y objetividad comprensiva; mientras que ${elemA === 'Agua' ? personA.name : personB.name} sumerge a su compañero en la mística del corazón, demostrándole que lo esencial del amor escapa a la lógica pura.`;
      break;
    case 'Fuego-Tierra':
      elementalText = `El contrato sagrado de ${personA.name} (${personA.sun.sign}, ${elemA}) y ${personB.name} (${personB.sun.sign}, ${elemB}) une la llama del deseo con la permanencia de la roca. La pasión creadora de ${elemA === 'Fuego' ? personA.name : personB.name} encuentra en la lealtad y paciencia de ${elemA === 'Tierra' ? personA.name : personB.name} la estructura para no dispersarse en vano; a su vez, la calidez de ${elemA === 'Fuego' ? personA.name : personB.name} desconhela cualquier pesadez rutinaria del otro.`;
      break;
    case 'Fuego-Fuego':
      elementalText = `El contrato entre ${personA.name} y ${personB.name} es el del Doble Fuego Sagrado: una alianza de soberanía, pasión sincera y compañerismo de aventuras. Han venido a reflejarse como iguales en nobleza, sin cobardías afectivas ni silencios rencorosos, celebrando la libertad del otro como una extensión de la propia.`;
      break;
    case 'Tierra-Tierra':
      elementalText = `El contrato de ${personA.name} y ${personB.name} es el del Templo de la Estabilidad: un pacto para construir un refugio de serenidad, honor y lealtad a prueba de tempestades. La presencia de ambos disuelve la ansiedad de la prisa moderna y confirma que el amor verdadero se demuestra en los actos del día a día.`;
      break;
    case 'Aire-Aire':
      elementalText = `El contrato entre ${personA.name} y ${personB.name} es el de la Comunión Alada: dos mentes que se eligen para conversar sin fin, desarmar prejuicios y acompañarse con una complicidad alegre que nunca pierde su curiosidad infantil.`;
      break;
    case 'Agua-Agua':
    default:
      elementalText = `El contrato de ${personA.name} y ${personB.name} es el del Océano Compartido: una resonancia anímica telepática donde sobran las explicaciones. Su pacto consiste en custodiar la fragilidad del otro como un tesoro sagrado, aprendiendo a ser ancla mutua en medio de las mareas del sentir.`;
      break;
  }

  // Matiz por superposición de casa clave si existe
  const mainOverlay = keyHouseOverlays[0];
  let overlayNote = '';
  if (mainOverlay) {
    if (mainOverlay.fallsInHouse === 7) {
      overlayNote = ` La posición de ${mainOverlay.planet} en Casa 7 destaca que su contrato central pasa por el matrimonio consciente y la capacidad de mirarse como un espejo divino.`;
    } else if (mainOverlay.fallsInHouse === 8) {
      overlayNote = ` Con ${mainOverlay.planet} en Casa 8, este contrato exige una entrega transparente y la transmutación valiente de los apegos del ego.`;
    } else if (mainOverlay.fallsInHouse === 4) {
      overlayNote = ` La activación de la Casa 4 confirma que su misión compartida es fundar un hogar y sanar las memorias de sus linajes familiares.`;
    } else if (mainOverlay.fallsInHouse === 9) {
      overlayNote = ` La resonancia en Casa 9 convoca a la pareja a viajar, expandir la mente y compartir una filosofía común de vida.`;
    } else if (mainOverlay.fallsInHouse === 5) {
      overlayNote = ` La impronta en Casa 5 sella su unión con la alegría creativa, el romance festivo y el arte de disfrutar juntos.`;
    }
  }

  return `${elementalText}${overlayNote}`;
}

/**
 * Genera narrativa de encuentro dinámica según Soles, Ascendentes y aspectos
 */
export function generateDynamicEncounter(digest: SynastryContextDigest): { title: string; narrative: string; soulContract: string } {
  const { personA, personB, overall, topInterAspects } = digest;
  const isTwin = overall.archetypeTitle.includes('Llamas Gemelas');

  const sunA = personA.sun.sign;
  const sunB = personB.sun.sign;
  const ascA = personA.ascendant.sign;
  const ascB = personB.ascendant.sign;
  const strongestAspect = topInterAspects[0]
    ? `${topInterAspects[0].pair} (${topInterAspects[0].aspect}, orbe ${topInterAspects[0].orb.toFixed(1)}°)`
    : 'una corriente armónica primordial';

  let firstPar = '';
  if (isTwin) {
    firstPar = `Existen encuentros en el tapiz del cosmos que desafían cualquier probabilidad terrenal y portan el sello irrefutable de una cita convenida antes del tiempo. La unión de ${personA.name} (Sol en ${sunA}, Ascendente en ${ascA}) y ${personB.name} (Sol en ${sunB}, Ascendente en ${ascB}) encarna la manifestación de "${overall.archetypeTitle}" (${overall.averageScore}% de Afinidad Global). Desde el primer cruce de miradas, sus almas no precisaron explicaciones: operó un reconocimiento inmediato, la certeza serena e imborrable de haber regresado al verdadero hogar.`;
  } else {
    firstPar = `Hay encuentros que el calendario profano clasifica como casuales, pero que en la memoria del firmamento llevan la impronta de una cita convenida. Al entrar en contacto la energía solar de ${personA.name} en ${sunA} con la impronta de ${personB.name} en ${sunB}, se inaugura un campo electromagnético que trasciende la afinidad superficial: se manifiesta el arquetipo de "${overall.archetypeTitle}" (${overall.averageScore}% de afinidad).`;
  }

  const secondPar = `El primer diálogo entre sus Ascendentes (${ascA} y ${ascB}) opera como una puerta de entrada arquetípica. Mientras que el aura de ${personA.name} (${ascA}) proyecta su manera particular de interactuar con el entorno, la presencia de ${personB.name} (${ascB}) genera una respuesta magnética inmediata. La sinastría está sellada por ${strongestAspect}, un contacto celeste que despierta zonas del alma que permanecían dormidas. Aquí el otro no llega como un transeúnte; llega como un llamado a vivir con mayor hondura y plenitud.`;

  const contract = generateDynamicSoulContract(digest);

  return {
    title: 'Sección 1 — El Encuentro de las Almas & El Umbral del Destino',
    narrative: `${firstPar}\n\n${secondPar}`,
    soulContract: contract,
  };
}

/**
 * Genera dinámicamente el mundo emocional de la pareja según sus dos Lunas
 */
export function generateDynamicLoveAndEmotions(digest: SynastryContextDigest): string {
  const { personA, personB } = digest;
  const moonA = personA.moon.sign;
  const moonB = personB.moon.sign;
  const elemA = getElementOfSign(moonA);
  const elemB = getElementOfSign(moonB);

  const prefix = `La danza íntima entre la Luna en ${moonA} de ${personA.name} (${elemA}) y la Luna en ${moonB} de ${personB.name} (${elemB}) configura el santuario secreto de la relación. `;

  if (elemA === 'Agua' && elemB === 'Agua') {
    return prefix + `Ambos comparten una sensibilidad oceánica: se intuyen antes de hablar y descifran los estados anímicos del otro sin necesidad de palabras. Su desafío es no ahogarse en susceptibilidades pasadas y brindarse cobijo seguro.`;
  }
  if ((elemA === 'Agua' && elemB === 'Tierra') || (elemA === 'Tierra' && elemB === 'Agua')) {
    return prefix + `Es una combinación de profunda nutrición. La Luna de Tierra ofrece estabilidad, ritmo pacífico y presencia corpórea; mientras que la Luna de Agua ablanda las exigencias y baña la convivencia con devoción y ternura.`;
  }
  if ((elemA === 'Fuego' && elemB === 'Aire') || (elemA === 'Aire' && elemB === 'Fuego')) {
    return prefix + `Su química afectiva es alegre, chispeante y ligera. La Luna de Fuego ama con pasión espontánea y protectora, mientras que la Luna de Aire ofrece ligereza mental, conversación cómplice y libertad sin asfixias.`;
  }
  if (elemA === 'Fuego' && elemB === 'Fuego') {
    return prefix + `Se aman con entusiasmo visceral y nobleza directa. Los enfados pasan como tormentas breves de verano y dan paso al abrazo leal; no hay rencores ocultos.`;
  }
  if (elemA === 'Tierra' && elemB === 'Tierra') {
    return prefix + `Su afecto se demuestra en la fidelidad cotidiana, los actos de cuidado y la creación de un nido seguro donde nada queda al azar.`;
  }
  if ((elemA === 'Agua' && elemB === 'Fuego') || (elemA === 'Fuego' && elemB === 'Agua')) {
    return prefix + `Una unión de fascinante intensidad: el Agua pide intimidad reservada y refugio delicado, mientras que el Fuego responde con pasión ardiente y optimismo. Cuando el Fuego aprende a templar su ímpetu y el Agua a expresar sus necesidades con claridad, se vuelven invencibles.`;
  }

  return prefix + `Ambas almas encuentran en este vínculo un puente para armonizar sus diferentes estilos afectivos, construyendo un código privado de ternura que se perfecciona día a día.`;
}

/**
 * Genera dinámicamente la sección de comunicación según los dos Mercurios
 */
export function generateDynamicCommunication(digest: SynastryContextDigest): string {
  const { personA, personB, compatibilityScores, overall } = digest;
  const isTwin = overall.archetypeTitle.includes('Llamas Gemelas');
  const mercA = personA.mercury.sign;
  const mercB = personB.mercury.sign;
  const commDim = compatibilityScores.find((d) => d.dimension.includes('Comunicación'))?.score || 85;

  if (isTwin) {
    return `Comunión Intelectual & Mente (${commDim}%): La sincronía entre Mercurio en ${mercA} de ${personA.name} y Mercurio en ${mercB} de ${personB.name} roza la telepatía afectiva. Pueden abordar desde las preguntas más hondas sobre la vida hasta el humor más cómplice con una fluidez pasmosa. La palabra entre ambos no se usa para competir, sino para iluminar el camino del otro.`;
  }

  const elemA = getElementOfSign(mercA);
  const elemB = getElementOfSign(mercB);

  let desc = `El intercambio entre Mercurio en ${mercA} de ${personA.name} y Mercurio en ${mercB} de ${personB.name} alcanza un índice de ${commDim}/100. `;
  if (elemA === elemB) {
    desc += `Al compartir la sintonía del elemento ${elemA}, la cadencia mental es inmediata: el hilo de los pensamientos fluye en el mismo canal y las conclusiones se alcanzan con rapidez natural.`;
  } else if ((elemA === 'Aire' && elemB === 'Fuego') || (elemA === 'Fuego' && elemB === 'Aire')) {
    desc += `El ingenio de uno aviva las certezas del otro. Las conversaciones son estimulantes, vivas y proactivas; juntos generan ideas que impulsan proyectos tangibles.`;
  } else if ((elemA === 'Tierra' && elemB === 'Agua') || (elemA === 'Agua' && elemB === 'Tierra')) {
    desc += `Un diálogo donde el pragmatismo y la intuición se complementan a la perfección. Uno aporta orden y claridad descriptiva, mientras que el otro aporta empatía y percepción de lo que subyace entre líneas.`;
  } else {
    desc += `Un encuentro fértil entre dos maneras diferentes de procesar la realidad: uno más analítico o racional y el otro más intuitivo o visceral. La clave radica en escuchar no para responder, sino para enriquecer la propia visión con los ojos del otro.`;
  }
  return desc;
}

/**
 * Genera dinámicamente la sección de química y atracción según Venus y Marte
 */
export function generateDynamicChemistry(digest: SynastryContextDigest): string {
  const { personA, personB, overall } = digest;
  const isTwin = overall.archetypeTitle.includes('Llamas Gemelas');
  const vA = personA.venus.sign;
  const mA = personA.mars.sign;
  const vB = personB.venus.sign;
  const mB = personB.mars.sign;

  if (isTwin) {
    return `La polaridad magnética entre Venus en ${vA}/Marte en ${mA} de ${personA.name} y Venus en ${vB}/Marte en ${mB} de ${personB.name} es la manifestación viva del magnetismo de Llamas Gemelas. No se trata solo de piel: es una atracción que compromete el alma, la mente y los sentidos. La seducción no se desgasta con la rutina; madura en una intimidad refinada, tierna y apasionadamente viva.`;
  }

  return `La alquimia erótica y el juego del deseo se tejen a través de Venus en ${vA} y Marte en ${mA} (${personA.name}) con Venus en ${vB} y Marte en ${mB} (${personB.name}). La belleza de esta polaridad reside en cómo el lenguaje del afecto y el impulso de conquista encuentran un terreno fértil. Es una corriente sensual que sabe ser refugio apacible y a la vez fuego transformador cuando se miran con total presencia.`;
}

/**
 * Genera el retrato arquetípico individual dinámico para Persona A o B
 */
export function generateIndividualPortrait(person: SynastryContextDigest['personA']): {
  identity: string;
  emotionalWorld: string;
  relationalStyle: string;
  hiddenWoundAndGift: string;
} {
  const elem = getElementOfSign(person.sun.sign);
  const moonElem = getElementOfSign(person.moon.sign);

  const identity = `${person.name} irradia la esencia de su Sol en ${person.sun.sign} (Casa ${person.sun.house}), anclada por la impronta de su Ascendente en ${person.ascendant.sign}. Su alquimia primordial responde a la vitalidad del elemento ${elem} con modalidad ${person.dominantModality}. Su presencia posee autenticidad y dignidad natural; busca vivir en congruencia con sus principios más elevados y no tolera la mediocridad afectiva.`;

  const emotionalWorld = `En su espacio más recóndito, la Luna en ${person.moon.sign} (Casa ${person.moon.house}, ${moonElem}) define su santuario interior. Su necesidad de cobijo no se satisface con palabras vacías: precisa autenticidad, constancia y respeto por sus tiempos íntimos. Su mente, configurada por Mercurio en ${person.mercury.sign}, procesa la vida con agudeza y sensibilidad para captar los matices de su entorno.`;

  const relationalStyle = `En el territorio amoroso, Venus en ${person.venus.sign} busca una conexión que integre admiración, belleza y verdad. Su forma de seducción es selectiva y honorable. Con Marte en ${person.mars.sign}, su energía de conquista y protección es firme: cuando decide amar y cuidar a alguien, lo hace con todo su ser.`;

  let woundAndGift = '';
  if (moonElem === 'Agua') {
    woundAndGift = `Su herida de vulnerabilidad suele ser el temor a que su profunda sensibilidad no sea comprendida o sea juzgada como excesiva. Su don más luminoso es una capacidad incondicional de amar, sanar y acoger el corazón ajeno.`;
  } else if (moonElem === 'Fuego') {
    woundAndGift = `Su vulnerabilidad radica en el miedo a ser coartada/o en su entusiasmo o a sentirse ignorada/o en su generosidad. Su mayor regalo al vínculo es una chispa de alegría inagotable, coraje protector y lealtad indoblegable.`;
  } else if (moonElem === 'Tierra') {
    woundAndGift = `Su punto delicado es la exigencia de control y el miedo a la inestabilidad imprevista. Su don supremo es la paz de saberse cuidado/a, la perseverancia y la certeza de que estará en los momentos más difíciles.`;
  } else {
    woundAndGift = `Su herida secreta es el temor al aislamiento mental o a que sus palabras sean desoídas. Su mayor tesoro es su mente lúcida, su capacidad de dialogar en calma y su ligereza sanadora.`;
  }

  return { identity, emotionalWorld, relationalStyle, hiddenWoundAndGift: woundAndGift };
}
