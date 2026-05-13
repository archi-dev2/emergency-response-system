import { NextResponse } from 'next/server';
import { DEMO_AMBULANCES, DEMO_HOSPITALS } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, latitude, longitude, severity, description } = body;

    // Validate required fields
    if (!patientId || latitude === undefined || longitude === undefined || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, latitude, longitude, severity' },
        { status: 400 }
      );
    }

    // Validate severity range
    if (severity < 1 || severity > 5) {
      return NextResponse.json(
        { error: 'Severity must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'latitude and longitude must be numbers' },
        { status: 400 }
      );
    }

    // Find nearest available ambulance (mock - just pick first available)
    const nearest = DEMO_AMBULANCES.find((a) => a.status === 'AVAILABLE') || DEMO_AMBULANCES[0];

    // Find nearest hospital (mock - pick AIIMS New Delhi)
    const nearestHospital = DEMO_HOSPITALS[2];

    // Generate request ID
    const requestId = `ER-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      requestId,
      status: 'PENDING',
      severity,
      description: description || null,
      ambulance: {
        id: nearest.id,
        driverName: nearest.driverName,
        vehicleNumber: nearest.vehicleNumber,
        driverPhone: nearest.driverPhone,
        currentLatitude: nearest.currentLatitude,
        currentLongitude: nearest.currentLongitude,
      },
      hospital: {
        id: nearestHospital.id,
        name: nearestHospital.name,
        address: nearestHospital.address,
        city: nearestHospital.city,
        phone: nearestHospital.phone,
        availableBeds: nearestHospital.availableBeds,
        icuAvailable: nearestHospital.icuAvailable,
      },
      estimatedETA: 480, // 8 minutes in seconds
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
