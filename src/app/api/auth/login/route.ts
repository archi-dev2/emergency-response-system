import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { emergencyContacts: true },
    });

    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({
      ...safeUser,
      allergies: JSON.parse(safeUser.allergies || '[]'),
      currentMedications: JSON.parse(safeUser.currentMedications || '[]'),
      chronicConditions: JSON.parse(safeUser.chronicConditions || '[]'),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
