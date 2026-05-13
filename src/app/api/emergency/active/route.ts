import { NextResponse } from 'next/server';
import { DEMO_EMERGENCIES, DEMO_AMBULANCES, DEMO_HOSPITALS, DEMO_PATIENTS } from '@/lib/mock-data';

export async function GET() {
  try {
    // Return only non-completed/cancelled emergencies as "active"
    const activeEmergencies = DEMO_EMERGENCIES
      .filter((e) => !['COMPLETED', 'CANCELLED'].includes(e.status))
      .map((em) => {
        const ambulance = em.ambulanceId
          ? DEMO_AMBULANCES.find((a) => a.id === em.ambulanceId) || null
          : null;
        const hospital = em.hospitalId
          ? DEMO_HOSPITALS.find((h) => h.id === em.hospitalId) || null
          : null;
        const patient = DEMO_PATIENTS.find((p) => p.id === em.patientId) || null;

        return {
          ...em,
          ambulance: ambulance
            ? {
                id: ambulance.id,
                driverName: ambulance.driverName,
                vehicleNumber: ambulance.vehicleNumber,
                driverPhone: ambulance.driverPhone,
                status: ambulance.status,
                currentLatitude: ambulance.currentLatitude,
                currentLongitude: ambulance.currentLongitude,
              }
            : null,
          hospital: hospital
            ? {
                id: hospital.id,
                name: hospital.name,
                address: hospital.address,
                city: hospital.city,
                availableBeds: hospital.availableBeds,
                icuAvailable: hospital.icuAvailable,
              }
            : null,
          patient: patient
            ? {
                id: patient.id,
                name: patient.name,
                bloodGroup: patient.bloodGroup,
                phone: patient.phone,
              }
            : null,
        };
      });

    return NextResponse.json({
      count: activeEmergencies.length,
      emergencies: activeEmergencies,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
