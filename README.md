# ASTRAL — Motor SaaS de Sinastría & Análisis Astrológico con IA

Plataforma web SaaS de análisis astrológico de alta precisión astronómica y compatibilidad profunda de almas mediante inteligencia artificial (Gemini API), construida con Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS) y un motor astronómico con licencia MIT.

---

## 🌟 Arquitectura en 4 Capas Desacopladas

Para salvaguardar el rigor técnico y evitar cualquier alucinación de datos astronómicos o puntuaciones arbitrarias, la aplicación opera bajo una estricta separación de cuatro capas:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CAPA 4: EXPERIENCIA VISUAL & UX                      │
│   Next.js 14+ (App Router) · React · Tailwind CSS · Framer Motion      │
│   Rueda Astrológica SVG Interactiva (Zoom, Tooltips, Bi-Wheel, Chords) │
│   Dashboard Editorial Cósmico · Reporte en 7 Secciones · Chat Flotante │
└──────────────────────────────────▲─────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│                   CAPA 3: INTERPRETACIÓN MEDIANTE IA                   │
│   Adaptador Gemini API (@google/generative-ai)                         │
│   Context Serializer (Digest compacto y denso en JSON)                 │
│   Generador de Reporte (7 secciones narrativas y arquetípicas)         │
│   Chat Contextual de Relación (Streaming con memoria optimizada)       │
└──────────────────────────────────▲─────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│            CAPA 2: ESTRUCTURACIÓN, SINASTRÍA & COMPATIBILIDAD          │
│   Motor de Aspectos (Ángulos reales, orbes dinámicos y ponderación)    │
│   Superposición de Casas (House Overlays A en B y B en A)              │
│   Cálculo de Carta Compuesta (Midpoints por arco menor < 180°)         │
│   Matriz Multidimensional de Compatibilidad (9 dimensiones con score)  │
└──────────────────────────────────▲─────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│                 CAPA 1: CÁLCULO DETERMINISTA & GEODATOS                │
│   Autocompletado Geográfico y Coordenadas (Photon / OpenStreetMap)     │
│   Resolución de Zona Horaria IANA (tz-lookup)                         │
│   Cálculo de Offset Histórico y DST (Intl / Luxon con DB Olson)       │
│   Motor Astronómico de Efemérides (astronomy-engine, VSOP87 / DE405)  │
│   Sistemas de Casas (Placidus predeterminado, Whole Sign, Equal)      │
│   Cálculo de Ascendente, MC, Nodos Lunares y Quirón                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Metodología de Cálculo

1. **Geolocalización & Zona Horaria Histórica**:
   - Búsqueda en tiempo real mediante Photon (OpenStreetMap).
   - Detección de zona IANA offline con polígonos geoespaciales (`tz-lookup`).
   - Resolución de horario de verano histórico y decretos (por ejemplo, GMT-4 en Perú durante el primer trimestre de 1990).
2. **Posiciones Planetarias**:
   - Efemérides geocéntricas aparentes para Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón, Nodos y Quirón vía `astronomy-engine` (modelos VSOP87 y JPL DE405 con precisión sub-arco-segundo, Licencia MIT sin restricciones de copyleft).
   - Detección de retrogradación mediante derivada angular.
3. **Casas Astrológicas**:
   - Cálculo trigonométrico a partir del Tiempo Sideral Local (RAMC) y la oblicuidad verdadera ($\varepsilon$).
   - Soporte para **Placidus** (trisección de semiarcos diurnos y nocturnos), **Whole Sign** (Casas Enteras) y **Equal** (Casas Iguales).
4. **Sinastría & Superposiciones**:
   - Comparación cruzada de todos los planetas de la persona A y B con orbes dinámicos según tipo de planeta (hasta 10° para luminarias).
   - Cálculo automático de en qué casa de la pareja cae cada planeta.
5. **Carta Compuesta (Midpoint Composite Chart)**:
   - Puntos medios calculados por el arco menor ($\le 180^\circ$).
   - Casas compuestas y aspectos internos de la entidad relacional.
6. **Sistema de Compatibilidad Multidimensional (0 a 100)**:
   - 9 dimensiones cuantitativas calculadas antes de llamar a la IA: *Conexión Emocional, Comunicación, Atracción, Romanticismo, Estabilidad, Intensidad, Conflicto, Crecimiento Mutuo, Compatibilidad Cotidiana*.

---

## 📦 Estructura del Proyecto

```
d:/ASTRAL/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts            # Endpoint de chat contextual sobre la relación
│   │   │   ├── geo/search/route.ts      # Autocompletado geográfico (Photon)
│   │   │   └── synastry/analyze/route.ts# Orquestador del análisis completo
│   │   ├── globals.css                  # Estilos cósmicos oscuros y animación
│   │   ├── layout.tsx                   # Layout raíz
│   │   └── page.tsx                     # Dashboard principal
│   ├── components/
│   │   ├── astrology/
│   │   │   └── AstroWheel.tsx           # Rueda SVG interactiva (Zoom, Tooltips, Bi-Wheel)
│   │   ├── chat/
│   │   │   └── RelationshipChat.tsx     # Interfaz de consulta interactiva con IA
│   │   ├── forms/
│   │   │   └── DualBirthForm.tsx        # Formulario dual con autocomplete y presets
│   │   └── report/
│   │       └── ReportView.tsx           # Reporte editorial en 7 secciones y pestañas
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── contextSerializer.ts     # Digest semántico compacto de tokens
│   │   │   └── geminiClient.ts          # Integración Gemini con fallback arquetípico
│   │   ├── astronomy/
│   │   │   ├── aspects.ts               # Motor de aspectos, orbes y pesos
│   │   │   ├── chart.ts                 # Orquestador de Carta Natal
│   │   │   ├── constants.ts             # Metadatos zodiacales y planetarios
│   │   │   ├── coordinates.ts           # Trigonometría esférica astrológica
│   │   │   ├── elements.ts              # Balance elemental y modal
│   │   │   ├── ephemeris.ts             # Efemérides VSOP87 / Nodos / Quirón
│   │   │   └── houses.ts                # Placidus, Whole Sign y Equal
│   │   ├── composite/
│   │   │   └── engine.ts                # Motor de Carta Compuesta
│   │   ├── geo/
│   │   │   ├── geocoding.ts             # Geocodificación y Photon API
│   │   │   └── timezone.ts              # IANA tz-lookup y resolución UTC histórica
│   │   ├── supabase/
│   │   │   ├── client.ts                # Cliente Supabase navegador
│   │   │   └── server.ts                # Cliente Supabase servidor
│   │   ├── synastry/
│   │   │   ├── compatibilityScores.ts   # Algoritmo de 9 dimensiones
│   │   │   ├── engine.ts                # Orquestador de sinastría
│   │   │   ├── houseOverlays.ts         # Proyección de planetas en casas
│   │   │   └── interAspects.ts          # Aspectos inter-cartas
│   │   ├── types/
│   │   │   └── astrology.ts             # Tipado TypeScript exhaustivo
│   │   └── validation/
│   │       └── birthProfile.ts          # Validaciones estrictas con Zod
│   └── __tests__/
│       └── astrology.test.ts            # Suite de pruebas unitarias automatizadas
├── supabase/
│   └── migrations/
│       └── 20260908_initial_schema.sql  # Esquema PostgreSQL completo con RLS
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## 🚀 Puesta en Marcha

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Variables de entorno
Crea un archivo `.env.local` basado en `.env.example`:
```env
# Google Gemini API (opcional: si no se provee, la app opera con el sintetizador arquetípico local de alta calidad)
GEMINI_API_KEY=tu_clave_de_gemini
GEMINI_MODEL=gemini-1.5-pro

# Supabase (opcional para persistencia SaaS)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Ejecutar pruebas unitarias
```bash
npm test
```

### 4. Compilar para producción
```bash
npm run build
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador: `http://localhost:3000`
