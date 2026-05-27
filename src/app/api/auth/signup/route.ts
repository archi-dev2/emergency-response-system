import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const ADMIN_INVITE_CODE = 'LIFELINK-ADMIN-2024';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, password, phone, role,
      // Patient fields
      bloodGroup, dateOfBirth, gender, address,
      allergies, currentMedications, chronicConditions,
      emergencyContact,
      // Driver fields
      vehicleNumber, licenseNumber, experience,
      // Hospital staff fields
      hospitalId, department, employeeId,
      // Admin fields
      adminCode,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const userRole = (role || 'PATIENT').toUpperCase();

    // Admin code verification
    if (userRole === 'ADMIN' && adminCode !== ADMIN_INVITE_CODE) {
      return NextResponse.json({ error: 'Invalid admin invite code' }, { status: 403 });
    }

    // Hospital existence check
    if (userRole === 'HOSPITAL_STAFF' && hospitalId) {
      const hosp = await prisma.hospital.findUnique({ where: { id: hospitalId } });
      if (!hosp) return NextResponse.json({ error: 'Selected hospital not found' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Build address string for driver/hospital to encode extra data
    let addressStr = address || null;
    if (userRole === 'DRIVER' && (licenseNumber || experience)) {
      addressStr = JSON.stringify({ licenseNumber: licenseNumber || '', experience: experience || '' });
    }
    if (userRole === 'HOSPITAL_STAFF' && (department || employeeId)) {
      addressStr = JSON.stringify({ department: department || '', employeeId: employeeId || '' });
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: name.trim(),
        phone: phone?.trim() || '',
        role: userRole,
        bloodGroup: bloodGroup || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        address: addressStr,
        isVerified: userRole === 'ADMIN',
        allergies: JSON.stringify(Array.isArray(allergies) ? allergies : []),
        currentMedications: JSON.stringify(Array.isArray(currentMedications) ? currentMedications : []),
        chronicConditions: JSON.stringify(Array.isArray(chronicConditions) ? chronicConditions : []),
        hospitalId: userRole === 'HOSPITAL_STAFF' ? (hospitalId || null) : null,
      },
      include: { emergencyContacts: true },
    });

    // Create emergency contact for patients
    if (userRole === 'PATIENT' && emergencyContact?.name && emergencyContact?.phone) {
      await prisma.emergencyContact.create({
        data: {
          userId: user.id,
          name: emergencyContact.name,
          relationship: emergencyContact.relationship || 'Other',
          phone: emergencyContact.phone,
        },
      });
    }

    // Link driver to ambulance by vehicle number
    if (userRole === 'DRIVER' && vehicleNumber) {
      const ambulance = await prisma.ambulance.findUnique({ where: { vehicleNumber } });
      if (ambulance && !ambulance.driverId) {
        await prisma.ambulance.update({
          where: { id: ambulance.id },
          data: { driverId: user.id, driverName: user.name, driverPhone: user.phone },
        });
      } else if (!ambulance) {
        // Create new ambulance record for driver
        await prisma.ambulance.create({
          data: {
            vehicleNumber,
            driverName: user.name,
            driverPhone: user.phone,
            driverId: user.id,
            status: 'AVAILABLE',
          },
        });
      }
    }

    // Welcome notification
    const welcomeMessages: Record<string, string> = {
      PATIENT: 'Your patient profile is ready. You can now use SOS, track ambulances, and access your medical records.',
      DRIVER: 'Your driver profile is active. Check your assignments dashboard to get started.',
      HOSPITAL_STAFF: 'Your hospital staff account is ready. Access the emergency queue and patient intake from your dashboard.',
      ADMIN: 'Admin account activated. You have full access to the LifeLink management console.',
    };

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Welcome to LifeLink!',
        message: welcomeMessages[userRole] || 'Your account is ready.',
      },
    });

    // Fetch updated user with emergency contacts
    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { emergencyContacts: true },
    });

    const { passwordHash: _, ...safeUser } = freshUser!;
    return NextResponse.json(
      {
        ...safeUser,
        allergies: JSON.parse((safeUser as { allergies: string }).allergies || '[]'),
        currentMedications: JSON.parse((safeUser as { currentMedications: string }).currentMedications || '[]'),
        chronicConditions: JSON.parse((safeUser as { chronicConditions: string }).chronicConditions || '[]'),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
