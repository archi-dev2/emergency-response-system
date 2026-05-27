import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const ambulances = await prisma.ambulance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ambulances, count: ambulances.length });
  } catch (error) {
    console.error('[GET /api/ambulances]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, driverName, driverPhone, hospitalId } = body;

    if (!vehicleNumber || !driverName || !driverPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicleNumber, driverName, driverPhone' },
        { status: 400 }
      );
    }

    const ambulance = await prisma.ambulance.create({
      data: {
        vehicleNumber,
        driverName,
        driverPhone,
        status: 'AVAILABLE',
        ...(hospitalId ? { hospitalId } : {}),
      },
    });

    return NextResponse.json(ambulance, { status: 201 });
  } catch (error) {
    console.error('[POST /api/ambulances]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
