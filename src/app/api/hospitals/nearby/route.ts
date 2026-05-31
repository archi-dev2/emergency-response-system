import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');

    const hospitals = await prisma.hospital.findMany({
      where: { isActive: true },
    });

    const parsed = hospitals.map((h) => ({
      ...h,
      specializations: (() => {
        try { return JSON.parse((h as any).specializations || '[]'); } catch { return []; }
      })(),
    }));

    // Fallback: no lat/lng provided — return all sorted by availableBeds desc
    if (!latParam || !lngParam) {
      const sorted = [...parsed].sort((a, b) => (b as any).availableBeds - (a as any).availableBeds);
      return NextResponse.json({ hospitals: sorted, count: sorted.length });
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    const radius = radiusParam ? parseFloat(radiusParam) : 100;

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid lat/lng parameters' }, { status: 400 });
    }

    const withDistance = parsed
      .map((h) => ({
        ...h,
        distance: parseFloat(haversine(lat, lng, (h as any).latitude, (h as any).longitude).toFixed(2)),
      }))
      .filter((h) => h.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    return NextResponse.json({ hospitals: withDistance, count: withDistance.length });
  } catch (error) {
    console.error('[GET /api/hospitals/nearby]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
