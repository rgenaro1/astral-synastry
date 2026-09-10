import { NextRequest, NextResponse } from 'next/server';
import { lookupTimezone } from '@/lib/geo/timezone';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');

  try {
    const timezone = lookupTimezone(lat, lng);
    return NextResponse.json({ timezone });
  } catch (error: any) {
    return NextResponse.json({ timezone: 'UTC' });
  }
}
