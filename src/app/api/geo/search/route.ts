import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/geo/geocoding';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ places: [] });
  }

  try {
    const places = await searchPlaces(query);
    return NextResponse.json({ places });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al buscar ubicaciones', details: error.message },
      { status: 500 }
    );
  }
}
