import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ambulance = await prisma.ambulance.findUnique({ where: { id } });
    if (!ambulance) return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 });
    return NextResponse.json(ambulance);
  } catch (error) {
    console.error('[GET /api/ambulances/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, currentLatitude, currentLongitude } = body;

    const data: { status?: string; currentLatitude?: number; currentLongitude?: number } = {};
    if (status !== undefined) data.status = status;
    if (currentLatitude !== undefined) data.currentLatitude = currentLatitude;
    if (currentLongitude !== undefined) data.currentLongitude = currentLongitude;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const ambulance = await prisma.ambulance.update({ where: { id }, data });
    return NextResponse.json(ambulance);
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 });
    console.error('[PATCH /api/ambulances/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
