import { NextResponse } from 'next/server';
import { DEMO_HOSPITALS } from '@/lib/mock-data';
import { haversineDistance } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = parseFloat(searchParams.get('radius') || '50'); // default 50km

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Provide valid lat and lng query parameters.' },
        { status: 400 }
      );
    }

    if (isNaN(radius) || radius <= 0) {
      return NextResponse.json(
        { error: 'Invalid radius. Must be a positive number in km.' },
        { status: 400 }
      );
    }

    // Calculate distance to each hospital and filter by radius
    const hospitalsWithDistance = DEMO_HOSPITALS
      .map((hospital) => ({
        ...hospital,
        distanceKm: parseFloat(
          haversineDistance(lat, lng, hospital.latitude, hospital.longitude).toFixed(2)
        ),
      }))
      .filter((h) => h.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      query: { latitude: lat, longitude: lng, radiusKm: radius },
      count: hospitalsWithDistance.length,
      hospitals: hospitalsWithDistance,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
