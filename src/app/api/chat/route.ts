import { NextRequest, NextResponse } from 'next/server';
import { chatWithRelationshipAssistant } from '@/lib/ai/geminiClient';
import { SynastryContextDigest } from '@/lib/ai/contextSerializer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { digest, messages, userMessage } = body as {
      digest: SynastryContextDigest;
      messages: { role: string; content: string }[];
      userMessage: string;
    };

    if (!digest || !userMessage) {
      return NextResponse.json(
        { error: 'Parámetros requeridos: digest y userMessage' },
        { status: 400 }
      );
    }

    const reply = await chatWithRelationshipAssistant(
      digest,
      messages || [],
      userMessage
    );

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json(
      { error: 'Error procesando la consulta', message: error.message },
      { status: 500 }
    );
  }
}
