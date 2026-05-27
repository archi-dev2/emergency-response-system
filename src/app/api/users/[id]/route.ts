import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function safeUser(u: { passwordHash: string; allergies: string; currentMedications: string; chronicConditions: string; [k: string]: unknown }) {
  const { passwordHash: _, allergies, currentMedications, chronicConditions, ...rest } = u;
  return {
    ...rest,
    allergies: (() => { try { return JSON.parse(allergies || '[]'); } catch { return []; } })(),
    currentMedications: (() => { try { return JSON.parse(currentMedications || '[]'); } catch { return []; } })(),
    chronicConditions: (() => { try { return JSON.parse(chronicConditions || '[]'); } catch { return []; } })(),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id }, include: { emergencyContacts: true } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(safeUser(user as Parameters<typeof safeUser>[0]));
  } catch (error) {
    console.error('[GET /api/users/[id]]', error);
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
    const data: { name?: string; phone?: string; address?: string; bloodGroup?: string; dateOfBirth?: string; gender?: string; allergies?: string; currentMedications?: string; chronicConditions?: string } = {};

    for (const field of ['name', 'phone', 'address', 'bloodGroup', 'dateOfBirth', 'gender'] as const) {
      if (body[field] !== undefined) data[field] = body[field];
    }
    for (const field of ['allergies', 'currentMedications', 'chronicConditions'] as const) {
      if (body[field] !== undefined) {
        data[field] = Array.isArray(body[field]) ? JSON.stringify(body[field]) : body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const user = await prisma.user.update({ where: { id }, data, include: { emergencyContacts: true } });
    return NextResponse.json(safeUser(user as Parameters<typeof safeUser>[0]));
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2025') return NextResponse.json({ error: 'User not found' }, { status: 404 });
    console.error('[PATCH /api/users/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.update({ where: { id }, data: { isVerified: false } });
    return NextResponse.json({ message: 'User deactivated successfully', id: user.id });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2025') return NextResponse.json({ error: 'User not found' }, { status: 404 });
    console.error('[DELETE /api/users/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
