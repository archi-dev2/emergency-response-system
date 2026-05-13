import { NextResponse } from 'next/server';
import { AMBULANCE_ROUTES, DEMO_AMBULANCES } from '@/lib/mock-data';

// In-memory waypoint tracker (per ambulance id)
// This is a simple counter that advances on each request to simulate movement
const waypointCounters: Record<string, number> = {};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Ambulance ID is required' },
        { status: 400 }
      );
    }

    // Find the ambulance
    const ambulance = DEMO_AMBULANCES.find((a) => a.id === id);
    if (!ambulance) {
      return NextResponse.json(
        { error: 'Ambulance not found' },
        { status: 404 }
      );
    }

    // Initialize or advance waypoint counter (cycles every 30 requests)
    if (!waypointCounters[id]) {
      waypointCounters[id] = 0;
    }
    waypointCounters[id] = (waypointCounters[id] + 1) % 30;

    // Use route data if available, otherwise simulate random movement
    const route = AMBULANCE_ROUTES[id];
    let currentLat: number;
    let currentLng: number;
    let bearing: number;
    let speed: number;
    let eta: number;
    let distanceRemaining: number;

    if (route && route.length > 0) {
      // Advance through the route, cycling
      const waypointIndex = waypointCounters[id] % route.length;
      const nextIndex = (waypointIndex + 1) % route.length;
      const current = route[waypointIndex];
      const next = route[nextIndex];

      currentLat = current.lat + (Math.random() - 0.5) * 0.001; // Small jitter
      currentLng = current.lng + (Math.random() - 0.5) * 0.001;
      bearing = parseFloat(
        (Math.atan2(next.lng - current.lng, next.lat - current.lat) * (180 / Math.PI) + 360).toFixed(1) % 360
      );
      speed = 25 + Math.random() * 30; // 25-55 km/h in city traffic
      eta = Math.max(0, Math.round(480 - (waypointIndex / route.length) * 480));
      distanceRemaining = parseFloat(
        Math.max(0, (1 - waypointIndex / route.length) * 3.5).toFixed(1)
      );
    } else {
      // Simulate random movement near the ambulance's last known position
      currentLat = ambulance.currentLatitude + (Math.random() - 0.5) * 0.005;
      currentLng = ambulance.currentLongitude + (Math.random() - 0.5) * 0.005;
      bearing = parseFloat((Math.random() * 360).toFixed(1));
      speed = 20 + Math.random() * 40;
      eta = 120 + Math.floor(Math.random() * 600);
      distanceRemaining = parseFloat((Math.random() * 10).toFixed(1));
    }

    const trackingData = {
      ambulanceId: id,
      driverName: ambulance.driverName,
      vehicleNumber: ambulance.vehicleNumber,
      driverPhone: ambulance.driverPhone,
      status: ambulance.status,
      location: {
        latitude: parseFloat(currentLat.toFixed(6)),
        longitude: parseFloat(currentLng.toFixed(6)),
      },
      bearing,
      speed: parseFloat(speed.toFixed(1)),
      eta,
      distanceRemaining,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(trackingData);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
