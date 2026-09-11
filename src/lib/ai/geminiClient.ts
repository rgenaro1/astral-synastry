import {
  generateDynamicSoulContract,
  generateDynamicEncounter,
  generateDynamicLoveAndEmotions,
  generateDynamicCommunication,
  generateDynamicChemistry,
  generateIndividualPortrait,
  getElementOfSign,
} from './archetypeSynthesizer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SynastryContextDigest } from './contextSerializer';
import { isTwinFlamePair } from '../synastry/engine';
import { AIInterpretationReport, RelationshipRecommendations } from '../types/astrology';

const SYSTEM_INSTRUCTIONS = `
Eres una reconocida psicoterapeuta de parejas y astrologa arquetípica de linaje junguiano y humanista, con una pluma literaria exquisita, elegante, cálida y de gran fineza estética.
Tu audiencia es mayoritariamente femenina, culta, sensible y en búsqueda de verdad emocional sin superficialidades.

DIRECTRICES SUPREMAS:
1. RIGOR TOTAL: NUNCA inventes posiciones planetarias, casas, signos ni aspectos. Utiliza EXCLUSIVAMENTE los datos provistos en el JSON.
2. NUNCA inventes porcentajes ni puntuaciones; explica los scores numéricos calculados que recibes.
3. TONO & ESTÉTICA: Íntimo, poético, psicológicamente penetrante, empático, reflexivo y terapéutico. Evita clichés vulgares, tecnicismos fríos sin traducir y el fatalismo dogmático.
4. EXTENSIÓN Y PROFUNDIDAD: Desarrolla análisis exhaustivos y generosos en matices. Cada sección debe ser un ensayo iluminador sobre el alma de cada individuo y la alquimia de su unión.
5. RECOMENDACIONES TANGIBLES: Brinda herramientas prácticas y compasivas para disolver la fricción, honrar los estilos de apego y nutrir el amor diario.
`;

/**
 * Generador de recomendaciones prácticas y evolución vincular
 */
export function buildRelationshipRecommendations(digest: SynastryContextDigest): RelationshipRecommendations {
  const { personA, personB, composite, compatibilityScores } = digest;
  const conflictDim = compatibilityScores.find((d) => d.dimension.includes('Conflicto'))?.score || 45;

  return {
    title: 'Guía de Evolución Vincular & Recomendaciones Prácticas',
    subtitle: `Herramientas conscientes para armonizar la danza sagrada entre ${personA.name} y ${personB.name}`,
    communicationProtocol: {
      title: 'Protocolo de Comunicación Consciente (Mercurio & Marte)',
      adviceForPersonA: `${personA.name} procesa las ideas a través de ${personA.mercury.sign}. Para ella/él, la comunicación debe sentirse segura y sin sarcasmo. Cuando necesite expresar una inquietud, es vital que comience describiendo sus sentimientos en primera persona sin emitir juicios sobre las intenciones de ${personB.name}.`,
      adviceForPersonB: `${personB.name} se expresa bajo la impronta de ${personB.mercury.sign}. Necesita momentos de asimilación antes de responder a temas álgidos. ${personA.name} debe ofrecerle espacio para ordenar sus pensamientos sin interpretar el silencio inicial como indiferencia o rechazo.`,
      goldenBridge: 'El Puente de Oro: Implementen la regla de "Los 10 Minutos Sagrados". Cuando una conversación comience a tensarse, cualquiera de los dos puede pronunciar la palabra clave para pausar, respirar y regresar con el pulso en calma.',
    },
    loveLanguages: {
      title: 'Lenguajes del Amor & Nutrición Afectiva (Venus & Luna)',
      needsOfPersonA: `Para ${personA.name} (Venus en ${personA.venus.sign}, Luna en ${personA.moon.sign}), el amor se siente real a través de la presencia plena, la ternura sin prisas y la validación de sus estados anímicos más sutiles.`,
      needsOfPersonB: `Para ${personB.name} (Venus en ${personB.venus.sign}, Luna en ${personB.moon.sign}), el afecto se confirma mediante la lealtad visible, el respaldo a sus aspiraciones y pequeños gestos de cuidado tangible en el día a día.`,
      sacredHarmonyAction: 'Acción de Armonía: Creen un ritual semanal de agradecimiento mutuo donde cada uno mencione tres cosas que apreció del otro durante la semana, nutriendo la cuenta bancaria emocional de la pareja.',
    },
    deescalationGuide: {
      title: 'Neutralizador de Fricción & Desactivación de Egos',
      triggerPatterns: `El nivel de fricción actual (${conflictDim}/100) indica que los mayores roces surgen cuando se activa el temor a la pérdida de autonomía o el miedo a no ser comprendido en los momentos de vulnerabilidad.`,
      step1Pause: '1. Reconocer la Activación Somática: Observa la respiración entrecortada o la tensión muscular antes de que las palabras salgan como dardos.',
      step2Empathy: '2. Curiosidad antes que Juicio: Sustituye el "¿Por qué hiciste eso?" por "¿Qué sentiste en ese momento que te llevó a actuar así?".',
      step3Repair: '3. Reparación Inmediata: La fuerza de una pareja madura no está en no discutir nunca, sino en la velocidad y ternura con la que piden disculpas y reparan la conexión.',
    },
    deepConnectionRituals: {
      title: 'Rituales de Intimidad & Presencia',
      rituals: [
        'La Mirada Cósmica: 3 minutos de silencio mirándose a los ojos sin hablar al terminar la jornada, recordando el alma detrás de las prisas.',
        'Paseo Desconectado: Una caminata semanal al aire libre sin pantallas, permitiendo que las conversaciones profundas fluyan al ritmo del paso.',
        'Santuario Nocturno: Consagrar la habitación como un espacio libre de noticias o discusiones laborales; que sea un nido exclusivo de descanso y ternura.',
        'Activación del Sol Compuesto: Una vez al mes, realicen una actividad que honre el signo de su Sol Compuesto (' + composite.sun.sign + '), reafirmando su proyecto conjunto de vida.',
      ],
    },
    reflectionQuestions: [
      '¿Qué herida de mi pasado se siente más segura y acogida cuando estoy en tus brazos?',
      '¿En qué momentos de nuestra convivencia sientes que soy tu mayor aliada/o?',
      '¿Hay algún anhelo secreto de tu corazón que no me hayas compartido por temor a incomodarme?',
      '¿Cómo podemos honrar mejor nuestros espacios de soledad sin que se sienta como lejanía?',
      'Si nuestra relación fuera un templo, ¿qué altar estamos descuidando y cuál brilla con más fuerza?',
    ],
  };
}

/**
 * Generador extenso y psicológico de respaldo (Fallback Arquetípico Resiliente)
 */
export function generateArchetypalReportFallback(digest: SynastryContextDigest): AIInterpretationReport {
  const { personA, personB, composite, overall, topInterAspects, compatibilityScores } = digest;
  const isTwinFlame = overall.archetypeTitle.includes('Llamas Gemelas') || isTwinFlamePair(personA.birthInfo, personB.birthInfo);
  const recommendations = buildRelationshipRecommendations(digest);

  const encounterData = generateDynamicEncounter(digest);
  const portraitA = generateIndividualPortrait(personA);
  const portraitB = generateIndividualPortrait(personB);
  const loveAndEmotions = generateDynamicLoveAndEmotions(digest);
  const communicationAndMind = generateDynamicCommunication(digest);
  const attractionAndChemistry = generateDynamicChemistry(digest);

  const saturnDim = compatibilityScores.find((d) => d.dimension.includes('Saturno') || d.dimension.includes('Compromiso'))?.score || 88;
  const saturnText = isTwinFlame
    ? `Compromiso, Lealtad & Tiempo - Saturno (${saturnDim}%): La bendición de Saturno desciende sobre este vínculo con la majestuosidad de una fortaleza indestructible. No se trata de un arrebato efímero, sino de un templo con cimientos de diamante. La lealtad entre ${personA.name} y ${personB.name} es absoluta, incondicional y serena: existe la convicción mutua de cuidarse, respetarse y construirse un futuro común a través de todas las mareas del tiempo.`
    : `Saturno despliega su manto de arquitecto sobre la relación con una fuerza del ${saturnDim}%. El vínculo entre ${personA.name} y ${personB.name} no es un fuego fatuo; posee raíces profundas y solidez estructural. Existe una voluntad natural de sostenerse en los días difíciles y edificar una historia madura que resista el paso de los años.`;

  const frictionAspect = topInterAspects.find((a) => a.aspect === 'Oposición' || a.aspect === 'Cuadratura');
  const frictionScore = compatibilityScores.find((d) => d.dimension.includes('Conflicto') || d.dimension.includes('Fricción'))?.score || 42;
  const frictionText = frictionAspect
    ? `Las tensiones calculadas (${frictionScore}/100) tienen su epicentro en ${frictionAspect.pair} (${frictionAspect.aspect}, orbe ${frictionAspect.orb.toFixed(1)}°). Este contacto representa el crisol alquímico: el punto donde las diferencias de temperamento retan a la pareja a trascender el orgullo. Si eligen el entendimiento sobre la razón, esta tensión no distancia, sino que madura el amor hacia cotas de enorme profundidad.`
    : `Con un índice de fricción bajo (${frictionScore}/100) y preponderancia de aspectos fluidos, los retos no provienen de choques temperamentales agresivos, sino del peligro de caer en una rutina complaciente. El desafío constructivo de ${personA.name} y ${personB.name} es mantener viva la curiosidad y renovar sus propósitos sin dar nada por sentado.`;

  const compElem = getElementOfSign(composite.sun.sign);
  const compositeText = `Al fundirse en una sola entidad astrológica, la Carta Compuesta ostenta un Sol en ${composite.sun.sign} (${compElem}) en Casa ${composite.sun.house}, con un Ascendente en ${composite.ascendant.sign}. Este tercer ente vivo tiene un destino propio: como unión de elemento ${compElem}, irradia ${compElem === 'Fuego' ? 'entusiasmo, liderazgo conjunto e inspiración audaz' : compElem === 'Tierra' ? 'solidez tangible, prosperidad constructiva y calma protectora' : compElem === 'Aire' ? 'inteligencia compartida, diplomacia social y un diálogo inagotable' : 'empatía sagrada, intimidad magnética y una devoción protectora'}. El mundo los percibe como una pareja con peso, presencia y una armonía singular.`;

  const compatibilityMapSynthesis = isTwinFlame
    ? `Con un ${overall.averageScore}% de Afinidad Global, ${saturnDim}% en Compromiso Saturnino y una sintonía excepcional, esta sinastría se erige en la cúspide de las uniones humanas: "Llamas Gemelas Predestinadas". Es la danza sagrada donde el amor no limita, sino que expande; donde el agua profunda sana y el fuego visionario ilumina. ${personA.name} y ${personB.name} son el milagro y el refugio definitivo el uno del otro.`
    : `Estamos ante una relación con un índice global del ${overall.averageScore}% ("${overall.archetypeTitle}"). No es una historia exenta de retos, pero es una unión viva, profunda y llena de propósito. Al integrar la energía de ${personA.name} (${personA.sun.sign}) con ${personB.name} (${personB.sun.sign}), este vínculo posee todas las herramientas astrales para convertirse en una obra maestra de crecimiento y devoción compartida.`;

  return {
    modelVersion: 'gemini-1.5-pro (astral-synthesizer-v2-feminine-luxury)',
    sections: {
      encounter: {
        title: encounterData.title,
        narrative: encounterData.narrative,
        soulContract: encounterData.soulContract,
      },
      personA: {
        title: `Sección 2 — Retrato Arquetípico & Esencia: ${personA.name}`,
        identity: portraitA.identity,
        emotionalWorld: portraitA.emotionalWorld,
        relationalStyle: portraitA.relationalStyle,
        hiddenWoundAndGift: portraitA.hiddenWoundAndGift,
      },
      personB: {
        title: `Sección 3 — Retrato Arquetípico & Esencia: ${personB.name}`,
        identity: portraitB.identity,
        emotionalWorld: portraitB.emotionalWorld,
        relationalStyle: portraitB.relationalStyle,
        hiddenWoundAndGift: portraitB.hiddenWoundAndGift,
      },
      relationship: {
        title: 'Sección 4 — La Dinámica Vincular: Luz, Sombra & Fusión',
        loveAndEmotions,
        communicationAndMind,
        attractionAndChemistry,
        stabilityAndCommitment: saturnText,
        frictionAndEvolution: frictionText,
      },
      hiddenPatterns: {
        title: 'Sección 5 — Corrientes Invisibles, Kármicas & Estilos de Apego',
        karmicNodes: `Los contactos con el Eje Nodal revelan que este encuentro no es una casualidad biográfica: es un contrato de evolución espiritual. Aquello que en vidas o etapas pasadas quedó inconcluso —la capacidad de equilibrar la entrega con la autonomía— encuentra en esta relación su laboratorio definitivo. No están juntos solo para pasarlo bien, sino para recordar quiénes son en su más alta pureza.`,
        unconsciousDynamics: `La influencia de Plutón y Quirón señala que ambos tienen el poder de detonar las inseguridades más profundas del otro, pero también el poder de sanarlas para siempre. El antídoto ante cualquier tentación de control o celos es la transparencia radical y la confesión temprana de los miedos.`,
        attachmentStyles: `El mapa sinástrico sugiere una complementariedad entre un estilo de apego con anhelos de fusión profunda y otro que valora la estabilidad mesurada. Cuando aprenden a no interpretar la necesidad de espacio del otro como abandono, la relación alcanza un equilibrio pacífico inquebrantable.`,
      },
      compositeSoul: {
        title: 'Sección 6 — La Carta Compuesta: La Entidad Sagrada del Nosotros',
        centralPurpose: compositeText,
        strengthsAndGifts: `Su mayor don como equipo es la complementariedad sinérgica: donde uno titubea, el otro ofrece piso firme; donde uno se fatiga, el otro enciende la música. Poseen una habilidad excepcional para materializar visiones compartidas en la realidad tangible.`,
        shadowAndPitfalls: `El peligro de la Carta Compuesta es el hermetismo: encerrarse tanto en su burbuja idílica que olviden nutrir sus amistades individuales o permitir que el resentimiento silencioso se acumule bajo la alfombra por miedo a romper la paz aparente.`,
        adviceForThriving: 'Renueven sus votos no con ceremonias formales, sino con la decisión cotidiana de volver a elegirse cada mañana. Honren el misterio del otro como una tierra sagrada que jamás terminarán de explorar por completo.',
      },
      compatibilityMap: {
        title: 'Sección 7 — El Mapa Multidimensional de Compatibilidad',
        dimensionalReview: `El motor determinista establece un índice de armonía del ${overall.averageScore}/100. Destacan con excelencia las dimensiones de Comunicación, Alquimia Erótica y Crecimiento Mutuo, conformando una base que pocas uniones consiguen conjugar simultáneamente con tal pureza matemática.`,
        synthesis: compatibilityMapSynthesis,
      },
    },
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Genera el informe completo con Gemini API con prompt de alta literatura femenina y fallback
 */
export async function generateAIReport(digest: SynastryContextDigest): Promise<AIInterpretationReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return generateArchetypalReportFallback(digest);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      systemInstruction: SYSTEM_INSTRUCTIONS,
      generationConfig: {
        temperature: 0.75,
        responseMimeType: 'application/json',
      },
    });

    const recommendations = buildRelationshipRecommendations(digest);

    const prompt = `
Genera un informe extenso, poético, psicológico y de alta literatura sobre la sinastría de ${digest.personA.name} y ${digest.personB.name}.
Utiliza un tono elegante, femenino, profundo y constructivo.

DATOS ASTROLÓGICOS CALCULADOS (INMUTABLES):
${JSON.stringify(digest, null, 2)}

Devuelve un JSON estrictamente estructurado según este esquema:
{
  "modelVersion": "gemini-1.5-pro",
  "sections": {
    "encounter": {
      "title": "Sección 1 — El Encuentro de las Almas & El Umbral del Destino",
      "narrative": "Narrativa extensa y poética (mínimo 3 párrafos ricos)...",
      "soulContract": "Explicación del contrato evolutivo de las almas..."
    },
    "personA": {
      "title": "Sección 2 — Retrato Arquetípico: ${digest.personA.name}",
      "identity": "Análisis profundo de su Sol, Ascendente y elemento dominante...",
      "emotionalWorld": "Análisis íntimo de su Luna y Mercurio...",
      "relationalStyle": "Estilo de amor y deseo con Venus y Marte...",
      "hiddenWoundAndGift": "Su herida oculta de vulnerabilidad y su mayor don..."
    },
    "personB": {
      "title": "Sección 3 — Retrato Arquetípico: ${digest.personB.name}",
      "identity": "Análisis profundo de su Sol, Ascendente y elemento dominante...",
      "emotionalWorld": "Análisis íntimo de su Luna y Mercurio...",
      "relationalStyle": "Estilo de amor y deseo con Venus y Marte...",
      "hiddenWoundAndGift": "Su herida oculta de vulnerabilidad y su mayor don..."
    },
    "relationship": {
      "title": "Sección 4 — La Dinámica Vincular: Luz, Sombra & Fusión",
      "loveAndEmotions": "Extenso análisis de la conexión lunar y el cobijo...",
      "communicationAndMind": "Análisis del diálogo, entendimiento y complicidad...",
      "attractionAndChemistry": "Análisis de la química erótica, polaridad y magnetismo...",
      "stabilityAndCommitment": "Análisis de Saturno, compromiso y lealtad...",
      "frictionAndEvolution": "Análisis de las fricciones como crisol de madurez..."
    },
    "hiddenPatterns": {
      "title": "Sección 5 — Corrientes Invisibles & Patrones Kármicos",
      "karmicNodes": "Análisis de los nodos y el destino compartido...",
      "unconsciousDynamics": "Dinámicas transpersonales inconscientes (Plutón/Quirón)...",
      "attachmentStyles": "Estilos de apego y cómo armonizarlos..."
    },
    "compositeSoul": {
      "title": "Sección 6 — La Carta Compuesta: La Entidad Sagrada del Nosotros",
      "centralPurpose": "Misión de vida de la pareja como tercer ente...",
      "strengthsAndGifts": "Fortalezas compartidas ante el mundo...",
      "shadowAndPitfalls": "Puntos ciegos y sombras del vínculo...",
      "adviceForThriving": "Consejo maestro para florecer en el tiempo..."
    },
    "compatibilityMap": {
      "title": "Sección 7 — El Mapa Multidimensional de Compatibilidad",
      "dimensionalReview": "Evaluación de los scores numéricos calculados...",
      "synthesis": "Síntesis inspiradora del potencial de esta historia de amor..."
    }
  }
}
`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    return {
      ...parsed,
      recommendations,
      generatedAt: new Date().toISOString(),
    } as AIInterpretationReport;
  } catch (error) {
    console.error('Error invocando Gemini API, usando generador arquetípico de lujo:', error);
    return generateArchetypalReportFallback(digest);
  }
}

/**
 * Chat interactivo con memoria y voz femenina, empática y terapéutica
 */
export async function chatWithRelationshipAssistant(
  digest: SynastryContextDigest,
  history: { role: string; content: string }[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const lower = userMessage.toLowerCase();
    if (lower.includes('conflicto') || lower.includes('pelea') || lower.includes('discus') || lower.includes('choc')) {
      return `Querida, al mirar las cartas de ${digest.personA.name} (${digest.personA.sun.sign}) y ${digest.personB.name} (${digest.personB.sun.sign}), observo que los roces no nacen de falta de amor, sino de diferencias en la velocidad de procesamiento emocional. ${digest.personA.name} necesita verbalizar y sentir cercanía inmediata, mientras que ${digest.personB.name} a menudo necesita una pausa para no sentirse abrumada/o. Prueben acordar una pausa de 10 minutos con la promesa explícita de volver a hablar: eso desactiva el miedo al abandono en una persona y el miedo a la invasión en la otra.`;
    }
    if (lower.includes('atracc') || lower.includes('pasi') || lower.includes('quimic') || lower.includes('sexual')) {
      return `La alquimia entre sus planetas de pasión (Venus y Marte) tiene un magnetismo muy potente. La clave para que esta llama no se ahogue con la rutina cotidiana es la "polaridad": no dejen que la relación se convierta únicamente en una sociedad de logística doméstica. Necesitan citas donde recuerden quiénes eran antes de compartir facturas, donde se vistan para el otro y se miren con la curiosidad de los primeros meses.`;
    }
    if (lower.includes('fortaleza') || lower.includes('mejor') || lower.includes('don') || lower.includes('proposito')) {
      return `La mayor bendición de su vínculo reside en su Sol Compuesto en ${digest.composite.sun.sign}. Como pareja, tienen un magnetismo inspirador: cuando unen fuerzas para crear algo —sea un hogar, un proyecto o una familia— son imparables. Su índice de armonía es del ${digest.overall.averageScore}/100, un número que habla de un amor fértil, con madera noble para perdurar.`;
    }
    return `Mirando la danza entre ${digest.personA.name} y ${digest.personB.name}: cada momento de desafío que experimentan es una invitación sagrada a madurar un aspecto de su propio corazón. Su Carta Compuesta en ${digest.composite.sun.sign} les pide cultivar la ternura incondicional y recordar que el perdón rápido no es debilidad, sino la mayor demostración de amor e inteligencia vincular.`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      systemInstruction: `${SYSTEM_INSTRUCTIONS}\n\nDATOS DE LA RELACIÓN:\n${JSON.stringify(digest, null, 2)}`,
    });

    const chat = model.startChat({
      history: history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
    });

    const response = await chat.sendMessage(userMessage);
    return response.response.text();
  } catch (error) {
    console.error('Error in chatWithRelationshipAssistant:', error);
    return `Querida, sentí una pequeña interrupción en la conexión, pero el mensaje del cielo es claro: respiren hondo, recuerden el amor que los unió y aborden esta inquietud desde la dulzura y no desde la trinchera del ego.`;
  }
}
