import { NextRequest, NextResponse } from 'next/server';
import { SynastryInputSchema } from '@/lib/validation/birthProfile';
import { calculateNatalChart } from '@/lib/astronomy/chart';
import { calculateSynastry } from '@/lib/synastry/engine';
import { calculateCompositeChart } from '@/lib/composite/engine';
import { buildSynastryDigest } from '@/lib/ai/contextSerializer';
import { generateAIReport } from '@/lib/ai/geminiClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SynastryInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { personA, personB, houseSystem } = parseResult.data;

    // 1. Calcular Cartas Natales deterministas
    const chartA = calculateNatalChart(personA, houseSystem);
    const chartB = calculateNatalChart(personB, houseSystem);

    // 2. Calcular Sinastría y Compatibilidad Multidimensional
    const synastry = calculateSynastry(chartA, chartB);

    // 3. Calcular Carta Compuesta
    const composite = calculateCompositeChart(chartA, chartB);

    // 4. Preparar Digest semántico optimizado para IA
    const digest = buildSynastryDigest(chartA, chartB, synastry, composite);

    // 5. Generar interpretación profunda con IA (Gemini con fallback integrado)
    const aiReport = await generateAIReport(digest);

    return NextResponse.json({
      success: true,
      chartA,
      chartB,
      synastry,
      composite,
      digest,
      aiReport,
    });
  } catch (error: any) {
    console.error('Error en /api/synastry/analyze:', error);
    return NextResponse.json(
      { error: 'Error procesando el análisis de sinastría', message: error.message },
      { status: 500 }
    );
  }
}
