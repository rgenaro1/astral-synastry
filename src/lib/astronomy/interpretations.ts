import { AspectType, PlanetId, ZodiacSignName } from '../types/astrology';

export interface PlanetArchetypeInfo {
  title: string;
  archetype: string;
  essence: string;
  feminineKeyword: string;
}

export const PLANET_ARCHETYPES: Record<string, PlanetArchetypeInfo> = {
  sun: {
    title: 'El Sol · La Esencia & El Brillo Consciente',
    archetype: 'El Yo Radiante y la Chispa Vital',
    essence: 'Representa tu centro consciente, la dignidad de tu corazón, tu vocación de brillar y cómo buscas ser reconocida en tu verdad.',
    feminineKeyword: 'Autoafirmación luminosa',
  },
  moon: {
    title: 'La Luna · El Alma & La Memoria Emocional',
    archetype: 'La Madre Interior y el Santuario Afectivo',
    essence: 'Gobernadora de tu intimidad, tus necesidades de nutrición afectiva, tu intuición más profunda y cómo te sientes en verdadero cobijo.',
    feminineKeyword: 'Intuición y seguridad anímica',
  },
  mercury: {
    title: 'Mercurio · La Voz & La Conexión Mental',
    archetype: 'El Tejedor de Ideas y el Mensajero Alado',
    essence: 'Cómo procesas la realidad, el estilo con el que expresas tus sentimientos y la afinidad de diálogo que necesitas con tu pareja.',
    feminineKeyword: 'Elocuencia y complicidad mental',
  },
  venus: {
    title: 'Venus · El Amor, El Deseo & La Belleza',
    archetype: 'La Amante Soberana y el Imán del Placer',
    essence: 'Tu lenguaje del amor, tus valores estéticos y relacionales, cómo seduces, cómo te entregas y qué te hace sentir verdaderamente amada y valorada.',
    feminineKeyword: 'Magnetismo y deleite sensorial',
  },
  mars: {
    title: 'Marte · La Pasión, La Iniciativa & El Fuego',
    archetype: 'La Guerrera Creativa y el Impulso de Conquista',
    essence: 'La fuerza de tu deseo, tu valentía para poner límites, tu química pasional y cómo defiendes tu espacio personal.',
    feminineKeyword: 'Fervor y asertividad visceral',
  },
  jupiter: {
    title: 'Júpiter · La Expansión & La Fe Vincular',
    archetype: 'La Guía Sabia y la Generosidad Cósmica',
    essence: 'Dónde encuentras optimismo, abundancia, aprendizaje mutuo y la capacidad de soñar en grande junto al otro.',
    feminineKeyword: 'Gracia y horizontes compartidos',
  },
  saturn: {
    title: 'Saturno · El Compromiso, El Tiempo & La Madurez',
    archetype: 'La Arquitecta del Destino y la Maestra de la Lealtad',
    essence: 'Dónde construyes solidez a prueba del tiempo, dónde enfrentas tus mayores temores de vulnerabilidad y cómo consagras la lealtad duradera.',
    feminineKeyword: 'Estructura protectora y fidelidad',
  },
  uranus: {
    title: 'Urano · La Autenticidad & La Chispa Eléctrica',
    archetype: 'La Rebelde Visionaria',
    essence: 'El anhelo de libertad, la necesidad de no asfixiarse en el vínculo y la originalidad creativa que refresca la unión.',
    feminineKeyword: 'Libertad lúcida e innovación',
  },
  neptune: {
    title: 'Neptuno · El Romance Sagrado & La Mística',
    archetype: 'La Soñadora Mística y la Compasión Infinita',
    essence: 'La idealización poética, la disolución de las fronteras del ego y el anhelo de fundir las almas en un abrazo devocional.',
    feminineKeyword: 'Poesía del alma y trascendencia',
  },
  pluto: {
    title: 'Plutón · El Poder Íntimo & La Alquimia Transformadora',
    archetype: 'La Fénix y la Diosa de las Profundidades',
    essence: 'El magnetismo que no se puede explicar, la capacidad de renacer de las crisis relacionales y la purificación de los apegos inconscientes.',
    feminineKeyword: 'Transmutación y renacimiento pasional',
  },
  chiron: {
    title: 'Quirón · La Herida Sagrada & El Don de Sanación',
    archetype: 'La Sanadora Empática',
    essence: 'La herida de vulnerabilidad que, al ser mirada con ternura por la pareja, se convierte en el refugio de mutua compasión.',
    feminineKeyword: 'Sanación afectiva y ternura',
  },
  north_node: {
    title: 'Nodo Norte · El Camino del Alma & El Destino',
    archetype: 'La Brújula Evolutiva',
    essence: 'La dirección hacia donde el vínculo te invita a crecer, salir de tu zona de confort y desplegar tu más alto potencial.',
    feminineKeyword: 'Evolución y llamado del destino',
  },
  south_node: {
    title: 'Nodo Sur · La Memoria Kármica & La Familiaridad',
    archetype: 'La Raíz Ancestral',
    essence: 'Patrones emocionales conocidos del pasado que brindan comodidad inmediata pero pueden convertirse en estancamiento si no se trascienden.',
    feminineKeyword: 'Sabiduría instintiva y desapego',
  },
};

export const HOUSE_INTERPRETATIONS: Record<number, { name: string; realm: string; description: string }> = {
  1: {
    name: 'Casa 1 · La Presencia & La Identidad',
    realm: 'El Ascendente y la Energía de Entrada',
    description: 'Influye directamente en la primera impresión, tu imagen magnética personal y cómo inicias nuevos capítulos en la vida y el amor.',
  },
  2: {
    name: 'Casa 2 · La Autoestima & Los Recursos',
    realm: 'El Valor Personal y la Estabilidad Tangible',
    description: 'Determina cómo te nutres, tus fuentes de placer sensorial, tu sentido de merecimiento y la seguridad material que construyes.',
  },
  3: {
    name: 'Casa 3 · La Mente & La Conversación Íntima',
    realm: 'El Diálogo Cotidiano y la Curiosidad',
    description: 'Rige los intercambios de mensajes, los apodos cariñosos, las risas espontáneas y la sintonía mental en el día a día.',
  },
  4: {
    name: 'Casa 4 · El Hogar & El Refugio del Alma',
    realm: 'El Templo Íntimo y las Raíces',
    description: 'El espacio seguro donde te quitas la armadura. Rige la convivencia, la intimidad doméstica y la sensación de pertenencia.',
  },
  5: {
    name: 'Casa 5 · El Romance, El Juego & La Creatividad',
    realm: 'El Corazón Lúdico y la Seducción',
    description: 'El escenario del enamoramiento, las citas mágicas, la sensualidad divertida, el arte y el gozo de sentirse deseada.',
  },
  6: {
    name: 'Casa 6 · Los Ritmos Diarios & El Cuidado Mutuo',
    realm: 'El Servicio Amoroso y la Salud',
    description: 'Los pequeños rituales cotidianos: prepararse un té, cuidar al otro cuando está exhausto y coordinar la vida real con gracia.',
  },
  7: {
    name: 'Casa 7 · La Pareja Consciente & El Espejo Sagrado',
    realm: 'El Compromiso Formal y el Nosotros',
    description: 'La casa del matrimonio del alma. Lo que buscas en un compañero de vida y la proyección de tu ideal de reciprocidad.',
  },
  8: {
    name: 'Casa 8 · La Intimidad Profunda & La Alquimia Sexual',
    realm: 'La Fusión Emocional y la Transformación',
    description: 'La entrega sin máscaras, la pasión erótica regeneradora, los secretos compartidos y la confianza a niveles viscerales.',
  },
  9: {
    name: 'Casa 9 · La Sabiduría, Los Viajes & La Filosofía',
    realm: 'La Expansión de Horizontes',
    description: 'Los viajes juntos, las conversaciones trascendentes a altas horas de la noche y el crecimiento espiritual compartido.',
  },
  10: {
    name: 'Casa 10 · La Vocación & El Reconocimiento',
    realm: 'El Legado Público y el Medio Cielo',
    description: 'La admiración por los talentos del otro, el apoyo en metas profesionales y cómo la relación es vista y celebrada por el entorno.',
  },
  11: {
    name: 'Casa 11 · La Amistad Sincera & Los Sueños Futuros',
    realm: 'La Complicidad y los Proyectos en Común',
    description: 'Ser mejores amigos antes que nada. Compartir causas, círculos sociales enriquecedores y proyectar un porvenir luminoso juntos.',
  },
  12: {
    name: 'Casa 12 · El Inconsciente & La Unión de Almas',
    realm: 'El Misterio, los Sueños y el Silencio Cósmico',
    description: 'La conexión telepática, los sueños compartidos, la compasión silenciosa y la comprensión que no necesita palabras.',
  },
};

/**
 * Retorna la interpretación contextual de un planeta en un signo y casa específicos
 */
export function getPlanetContextualMeaning(
  planetId: PlanetId,
  sign: ZodiacSignName,
  house: number
): { title: string; explanation: string; guidance: string } {
  const archetype = PLANET_ARCHETYPES[planetId] || PLANET_ARCHETYPES.sun;
  const houseData = HOUSE_INTERPRETATIONS[house] || HOUSE_INTERPRETATIONS[1];

  let explanation = '';
  let guidance = '';

  switch (planetId) {
    case 'sun':
      explanation = `Tu energía esencial se expresa con la calidez y matices de ${sign}, proyectándose activamente en tu ${houseData.name}. Tu vitalidad florece cuando honras tu estilo ${sign} en este ámbito de vida.`;
      guidance = `Permítete ser vista en tu verdad. En la pareja, tu Sol en ${sign} necesita respeto por tu soberanía y celebración de tus talentos.`;
      break;
    case 'moon':
      explanation = `Tu santuario anímico vibra en ${sign} y encuentra su refugio en tu ${houseData.name}. Cuando estás sensible o agotada, tu alma busca la medicina de ${sign} para volver a su centro.`;
      guidance = `Expresa tus necesidades sin culpa. Tu pareja te cuidará mejor si comprende que para ti la seguridad emocional se siente como la energía nutricia de ${sign}.`;
      break;
    case 'mercury':
      explanation = `Tu mente e ingenio fluyen al ritmo de ${sign}, canalizándose en tu ${houseData.name}. Eres capaz de tender puentes con palabras llenas de ${sign}.`;
      guidance = `En los momentos de desacuerdo, recuérdale a tu pareja cómo prefieres dialogar y asegúrate de escuchar con el corazón abierto.`;
      break;
    case 'venus':
      explanation = `Tu código de amor y magnetismo se viste con la elegancia de ${sign} y se despliega en tu ${houseData.name}. Para ti, el afecto verdadero se demuestra con los valores de ${sign}.`;
      guidance = `No negocies tu valor. Tu encanto florece cuando te sientes admirada, mimada y en un entorno que refleje armonía y belleza.`;
      break;
    case 'mars':
      explanation = `La llama de tu deseo y tu valentía arde con el fuego de ${sign} dentro de tu ${houseData.name}. Tienes una fuerza instintiva para defender lo que amas.`;
      guidance = `Canaliza tu pasión de forma constructiva; evita la impaciencia y utiliza este fuego para renovar la atracción y superar cualquier obstáculo.`;
      break;
    case 'saturn':
      explanation = `Saturno en ${sign} (Casa ${house}) es tu templo de maestría. Aquí has sentido exigencia o timidez en el pasado, pero es el lugar donde construirás tu mayor madurez y lealtad.`;
      guidance = `Ten paciencia contigo misma. Lo que Saturno toca madura como el vino fino: se vuelve inquebrantable con los años.`;
      break;
    case 'jupiter':
      explanation = `Júpiter en ${sign} (Casa ${house}) bendice este territorio con optimismo, suerte y generosidad. Es tu manantial de abundancia y fe.`;
      guidance = `Comparte tu visión esperanzadora con tu pareja; juntos pueden expandir sus horizontes mucho más allá de lo imaginado.`;
      break;
    default:
      explanation = `${archetype.title} en ${sign} sitúa su energía en tu ${houseData.name}, aportando ${archetype.feminineKeyword} a tu camino evolutivo.`;
      guidance = `Abraza esta energía como parte de tu alquimia única.`;
      break;
  }

  return {
    title: `${archetype.title} en ${sign} (Casa ${house})`,
    explanation,
    guidance,
  };
}

/**
 * Retorna la interpretación de un aspecto específico entre dos planetas
 */
export function getAspectMeaning(
  planet1Name: string,
  planet2Name: string,
  type: AspectType,
  orb: number
): { title: string; description: string; advice: string } {
  const isClose = orb <= 2.5;
  const intensity = isClose ? 'muy intenso y directo' : 'activo';

  if (type === 'conjunction') {
    return {
      title: `Conjunción íntima entre ${planet1Name} y ${planet2Name}`,
      description: `Las energías de ambos cuerpos se funden en un solo haz de luz (${intensity}, orbe ${orb}°). Operan al unísono, creando una resonancia inmediata donde las intenciones se alinean con fuerza magnética.`,
      advice: 'Aprovechen esta poderosa sincronía como un motor compartido, manteniendo siempre espacios saludables para no perder sus contornos individuales.',
    };
  }

  if (type === 'trine') {
    return {
      title: `Trígono armónico entre ${planet1Name} y ${planet2Name}`,
      description: `Un flujo celestial de gracia y comprensión natural (${intensity}, orbe ${orb}°). Es un talento innato de la relación: la energía fluye sin esfuerzo, trayendo dulzura, empatía y alivio mutuo.`,
      advice: 'No den por sentada esta armonía; celébrala y úsenla como refugio cuando otras áreas de la vida resulten desafiantes.',
    };
  }

  if (type === 'sextile') {
    return {
      title: `Sextil estimulante entre ${planet1Name} y ${planet2Name}`,
      description: `Una chispa de oportunidad, complicidad y cooperación fluida (${intensity}, orbe ${orb}°). Estimula la creatividad, las conversaciones agradables y el apoyo mutuo.`,
      advice: 'Abran la puerta a planes nuevos juntos; este contacto premia las iniciativas compartidas.',
    };
  }

  if (type === 'square') {
    return {
      title: `Cuadratura desafiante entre ${planet1Name} y ${planet2Name}`,
      description: `Una tensión dinámica (${intensity}, orbe ${orb}°). No significa incompatibilidad, sino un llamado a la madurez: empuja a ambos a salir del ego, pulir asperezas y evolucionar conscientemente.`,
      advice: 'Cuando sientan el roce, no busquen tener la razón. Pregúntense: ¿Qué herida mía está tocando esto y cómo puedo comunicarlo con dulzura en vez de con defensa?',
    };
  }

  if (type === 'opposition') {
    return {
      title: `Oposición polar entre ${planet1Name} y ${planet2Name}`,
      description: `El juego del espejo perfecto (${intensity}, orbe ${orb}°). Se sienten atraídos magnéticamente por lo que el otro tiene y a la vez pueden proyectar sus propias sombras en la pareja.`,
      advice: 'El secreto de la oposición es la complementariedad: lo que ves en el otro no es tu enemigo, es tu otra mitad integrando la danza de la totalidad.',
    };
  }

  return {
    title: `Quincuncio de ajuste entre ${planet1Name} y ${planet2Name}`,
    description: `Una energía que requiere pequeños reajustes periódicos de perspectiva (${intensity}, orbe ${orb}°). Invita a la flexibilidad y la aceptación cariñosa de las diferencias.`,
    advice: 'Cultiven el sentido del humor y la ternura ante las pequeñas rarezas del otro.',
  };
}
