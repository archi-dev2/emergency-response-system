import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Demo@12345', 12);

  // 1. Hospitals
  const hospitals = await Promise.all([
    prisma.hospital.upsert({
      where: { id: 'hosp-1' },
      update: {},
      create: {
        id: 'hosp-1',
        name: 'Apollo Hospitals',
        address: '21, Greams Lane, Off Greams Road',
        city: 'Chennai',
        latitude: 13.0604,
        longitude: 80.2496,
        phone: '+91-44-28293333',
        email: 'info@apollohospitals.com',
        totalBeds: 550,
        availableBeds: 45,
        icuTotal: 60,
        icuAvailable: 8,
        emergencyRating: 4.8,
        isActive: true,
        specializations: JSON.stringify(['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Transplant']),
      },
    }),
    prisma.hospital.upsert({
      where: { id: 'hosp-2' },
      update: {},
      create: {
        id: 'hosp-2',
        name: 'Fortis Memorial Research Institute',
        address: 'Sector 44, Opposite HUDA City Centre',
        city: 'Gurugram',
        latitude: 28.4595,
        longitude: 77.0266,
        phone: '+91-124-4921021',
        email: 'fmri@fortishealthcare.com',
        totalBeds: 310,
        availableBeds: 30,
        icuTotal: 40,
        icuAvailable: 5,
        emergencyRating: 4.7,
        isActive: true,
        specializations: JSON.stringify(['Neurosurgery', 'Cardiology', 'Robotic Surgery', 'Liver Transplant']),
      },
    }),
    prisma.hospital.upsert({
      where: { id: 'hosp-3' },
      update: {},
      create: {
        id: 'hosp-3',
        name: 'AIIMS New Delhi',
        address: 'Sri Aurobindo Marg, Ansari Nagar',
        city: 'New Delhi',
        latitude: 28.5672,
        longitude: 77.21,
        phone: '+91-11-26588500',
        email: 'director@aiims.edu',
        totalBeds: 2478,
        availableBeds: 120,
        icuTotal: 200,
        icuAvailable: 18,
        emergencyRating: 4.9,
        isActive: true,
        specializations: JSON.stringify(['All Specialties', 'Trauma', 'Burns', 'Cardiothoracic']),
      },
    }),
  ]);
  console.log(`Created ${hospitals.length} hospitals`);

  // 2. Demo Users
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@lifelink.com' },
    update: {},
    create: {
      email: 'patient@lifelink.com',
      passwordHash,
      name: 'Arjun Mehta',
      phone: '+91-9876543210',
      role: 'PATIENT',
      isVerified: true,
      patientProfile: {
        create: {
          bloodGroup: 'B_POS',
          dateOfBirth: '1990-05-15',
          gender: 'MALE',
          allergies: JSON.stringify(['Penicillin', 'Sulfa drugs']),
          currentMedications: JSON.stringify(['Metformin 500mg', 'Lisinopril 10mg']),
          chronicConditions: JSON.stringify(['Type 2 Diabetes', 'Hypertension']),
        }
      },
      emergencyContacts: {
        create: [
          { name: 'Priya Mehta', relationship: 'Spouse', phone: '+91-9876543220' },
          { name: 'Suresh Mehta', relationship: 'Father', phone: '+91-9876543221' },
        ]
      }
    },
  });

  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@lifelink.com' },
    update: {},
    create: {
      email: 'driver@lifelink.com',
      passwordHash,
      name: 'Rajesh Kumar',
      phone: '+91-9876543101',
      role: 'DRIVER',
      isVerified: true,
      driverProfile: {
        create: {
          licenseNumber: 'DL-12345678',
          status: 'AVAILABLE'
        }
      }
    },
  });

  const hospitalUser = await prisma.user.upsert({
    where: { email: 'hospital@lifelink.com' },
    update: {},
    create: {
      email: 'hospital@lifelink.com',
      passwordHash,
      name: 'Dr. Ananya Gupta',
      phone: '+91-9876543201',
      role: 'HOSPITAL_STAFF',
      hospitalId: 'hosp-3',
      isVerified: true,
      staffProfile: {
        create: {
          department: 'Emergency',
          employeeId: 'EMP-001'
        }
      }
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lifelink.com' },
    update: {},
    create: {
      email: 'admin@lifelink.com',
      passwordHash,
      name: 'Admin User',
      phone: '+91-9876543301',
      role: 'ADMIN',
      isVerified: true,
      adminProfile: {
        create: {
          organizationName: 'LifeLink Systems'
        }
      }
    },
  });

  console.log('Created 4 demo users with proper profiles');

  // 3. Ambulances
  const ambulance = await prisma.ambulance.upsert({
    where: { id: 'amb-1' },
    update: {},
    create: { 
      id: 'amb-1', 
      vehicleNumber: 'DL01AB1234', 
      driverName: 'Rajesh Kumar', 
      driverPhone: '+91-9876543101', 
      hospitalId: 'hosp-3', 
      driverId: driverUser.id, 
      status: 'AVAILABLE', 
      currentLatitude: 28.5693, 
      currentLongitude: 77.2122 
    },
  });

  console.log('Created 1 test ambulance linked to Driver profile');
  console.log('\nSeeding complete!');
  console.log('\nDemo accounts (password: Demo@12345):');
  console.log('  patient@lifelink.com  -> PATIENT');
  console.log('  driver@lifelink.com   -> DRIVER');
  console.log('  hospital@lifelink.com -> HOSPITAL_STAFF');
  console.log('  admin@lifelink.com    -> ADMIN');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });