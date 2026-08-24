import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Demo@12345', 12);

  // ---------------------------
  // 1. Hospitals
  // ---------------------------
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
    prisma.hospital.upsert({
      where: { id: 'hosp-4' },
      update: {},
      create: {
        id: 'hosp-4',
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows',
        city: 'Mumbai',
        latitude: 19.1364,
        longitude: 72.8296,
        phone: '+91-22-42696969',
        email: 'info@kokilabenhospital.com',
        totalBeds: 750,
        availableBeds: 60,
        icuTotal: 80,
        icuAvailable: 10,
        emergencyRating: 4.8,
        isActive: true,
        specializations: JSON.stringify(['Cancer', 'Heart', 'Neuro', 'Orthopedics', 'Pediatrics']),
      },
    }),
    prisma.hospital.upsert({
      where: { id: 'hosp-5' },
      update: {},
      create: {
        id: 'hosp-5',
        name: 'Manipal Hospital',
        address: '98, HAL Airport Road, Kodihalli',
        city: 'Bangalore',
        latitude: 12.9614,
        longitude: 77.6406,
        phone: '+91-80-25023000',
        email: 'info@manipalhospitals.com',
        totalBeds: 600,
        availableBeds: 50,
        icuTotal: 70,
        icuAvailable: 9,
        emergencyRating: 4.7,
        isActive: true,
        specializations: JSON.stringify(['Cardiology', 'Neurology', 'Oncology', 'Gastroenterology']),
      },
    }),
    prisma.hospital.upsert({
      where: { id: 'hosp-6' },
      update: {},
      create: {
        id: 'hosp-6',
        name: 'Medanta - The Medicity',
        address: 'CH Baktawar Singh Road, Sector 38',
        city: 'Gurugram',
        latitude: 28.4636,
        longitude: 77.0493,
        phone: '+91-124-4141414',
        email: 'info@medanta.org',
        totalBeds: 1600,
        availableBeds: 100,
        icuTotal: 150,
        icuAvailable: 20,
        emergencyRating: 4.8,
        isActive: true,
        specializations: JSON.stringify(['Heart Institute', 'Neuro', 'Kidney', 'Bone & Joint']),
      },
    }),
    prisma.hospital.upsert({
      where: { id: 'hosp-7' },
      update: {},
      create: {
        id: 'hosp-7',
        name: 'Christian Medical College',
        address: 'Ida Scudder Road',
        city: 'Vellore',
        latitude: 12.9289,
        longitude: 79.1316,
        phone: '+91-416-2281000',
        email: 'info@cmcvellore.ac.in',
        totalBeds: 2700,
        availableBeds: 150,
        icuTotal: 180,
        icuAvailable: 22,
        emergencyRating: 4.9,
        isActive: true,
        specializations: JSON.stringify(['Hematology', 'Nephrology', 'Infectious Disease', 'Rheumatology']),
      },
    }),
    prisma.hospital.upsert({
      where: { id: 'hosp-8' },
      update: {},
      create: {
        id: 'hosp-8',
        name: 'Tata Memorial Hospital',
        address: 'Dr Ernest Borges Road, Parel',
        city: 'Mumbai',
        latitude: 18.9966,
        longitude: 72.8311,
        phone: '+91-22-24177000',
        email: 'info@tmc.gov.in',
        totalBeds: 700,
        availableBeds: 40,
        icuTotal: 60,
        icuAvailable: 6,
        emergencyRating: 4.7,
        isActive: true,
        specializations: JSON.stringify(['Oncology', 'Radiation Therapy', 'Surgical Oncology', 'Pediatric Oncology']),
      },
    }),
  ]);

  console.log(`Created ${hospitals.length} hospitals`);

  // ---------------------------
  // 2. Demo Users
  // ---------------------------
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@lifelink.com' },
    update: {},
    create: {
      email: 'patient@lifelink.com',
      passwordHash,
      name: 'Arjun Mehta',
      phone: '+91-9876543210',
      role: 'PATIENT',
      bloodGroup: 'B_POS',
      dateOfBirth: '1990-05-15',
      gender: 'MALE',
      address: 'B-12, Sector 62, Noida, Uttar Pradesh 201309',
      isVerified: true,
      allergies: JSON.stringify(['Penicillin', 'Sulfa drugs']),
      currentMedications: JSON.stringify(['Metformin 500mg', 'Lisinopril 10mg']),
      chronicConditions: JSON.stringify(['Type 2 Diabetes', 'Hypertension']),
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
      allergies: JSON.stringify([]),
      currentMedications: JSON.stringify([]),
      chronicConditions: JSON.stringify([]),
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
      allergies: JSON.stringify([]),
      currentMedications: JSON.stringify([]),
      chronicConditions: JSON.stringify([]),
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
      allergies: JSON.stringify([]),
      currentMedications: JSON.stringify([]),
      chronicConditions: JSON.stringify([]),
    },
  });

  console.log('Created 4 demo users');

  // ---------------------------
  // 3. Emergency Contacts for Patient
  // ---------------------------
  const existingContacts = await prisma.emergencyContact.findMany({ where: { userId: patientUser.id } });
  if (existingContacts.length === 0) {
    await prisma.emergencyContact.createMany({
      data: [
        { userId: patientUser.id, name: 'Priya Mehta', relationship: 'Spouse', phone: '+91-9876543220' },
        { userId: patientUser.id, name: 'Suresh Mehta', relationship: 'Father', phone: '+91-9876543221' },
      ],
    });
    console.log('Created emergency contacts for patient');
  }

  // ---------------------------
  // 4. Ambulances
  // ---------------------------
  const ambulanceData = [
    { id: 'amb-1', vehicleNumber: 'DL01AB1234', driverName: 'Rajesh Kumar', driverPhone: '+91-9876543101', hospitalId: 'hosp-3', driverId: driverUser.id, status: 'AVAILABLE', currentLatitude: 28.5693, currentLongitude: 77.2122 },
    { id: 'amb-2', vehicleNumber: 'DL01AB5678', driverName: 'Amit Singh', driverPhone: '+91-9876543102', hospitalId: 'hosp-3', status: 'ON_DUTY', currentLatitude: 28.6, currentLongitude: 77.2 },
    { id: 'amb-3', vehicleNumber: 'MH01CD2345', driverName: 'Suresh Patil', driverPhone: '+91-9876543103', hospitalId: 'hosp-4', status: 'AVAILABLE', currentLatitude: 19.14, currentLongitude: 72.83 },
    { id: 'amb-4', vehicleNumber: 'MH01CD6789', driverName: 'Ramesh Yadav', driverPhone: '+91-9876543104', hospitalId: 'hosp-8', status: 'AVAILABLE', currentLatitude: 19.0, currentLongitude: 72.83 },
    { id: 'amb-5', vehicleNumber: 'KA01EF3456', driverName: 'Venkatesh Rao', driverPhone: '+91-9876543105', hospitalId: 'hosp-5', status: 'MAINTENANCE', currentLatitude: 12.96, currentLongitude: 77.64 },
    { id: 'amb-6', vehicleNumber: 'TN01GH4567', driverName: 'Murugan K', driverPhone: '+91-9876543106', hospitalId: 'hosp-1', status: 'AVAILABLE', currentLatitude: 13.06, currentLongitude: 80.25 },
    { id: 'amb-7', vehicleNumber: 'HR01IJ5678', driverName: 'Deepak Sharma', driverPhone: '+91-9876543107', hospitalId: 'hosp-2', status: 'AVAILABLE', currentLatitude: 28.46, currentLongitude: 77.03 },
    { id: 'amb-8', vehicleNumber: 'HR01IJ9012', driverName: 'Pankaj Verma', driverPhone: '+91-9876543108', hospitalId: 'hosp-6', status: 'ON_DUTY', currentLatitude: 28.47, currentLongitude: 77.05 },
    { id: 'amb-9', vehicleNumber: 'TN01KL6789', driverName: 'Selvam R', driverPhone: '+91-9876543109', hospitalId: 'hosp-7', status: 'AVAILABLE', currentLatitude: 12.93, currentLongitude: 79.13 },
    { id: 'amb-10', vehicleNumber: 'DL01MN7890', driverName: 'Naresh Tiwari', driverPhone: '+91-9876543110', hospitalId: 'hosp-3', status: 'AVAILABLE', currentLatitude: 28.57, currentLongitude: 77.21 },
  ];

  for (const amb of ambulanceData) {
    await prisma.ambulance.upsert({
      where: { id: amb.id },
      update: {},
      create: amb,
    });
  }

  console.log(`Created ${ambulanceData.length} ambulances`);

  // ---------------------------
  // 5. Medical Records for Patient
  // ---------------------------
  const existingRecords = await prisma.medicalRecord.findMany({ where: { patientId: patientUser.id } });
  if (existingRecords.length === 0) {
    await prisma.medicalRecord.createMany({
      data: [
        {
          patientId: patientUser.id,
          type: 'DIAGNOSIS',
          title: 'Type 2 Diabetes Diagnosis',
          description: 'Fasting blood glucose: 145 mg/dL. HbA1c: 7.2%. Diagnosed with Type 2 Diabetes Mellitus. Started on Metformin 500mg twice daily.',
          date: '2022-03-10',
          doctorName: 'Dr. Rakesh Sharma',
          hospitalName: 'Apollo Hospitals, Chennai',
        },
        {
          patientId: patientUser.id,
          type: 'PRESCRIPTION',
          title: 'Hypertension Medication',
          description: 'BP: 145/92 mmHg. Prescribed Lisinopril 10mg once daily. Diet and lifestyle modifications advised.',
          date: '2023-07-22',
          doctorName: 'Dr. Priya Nair',
          hospitalName: 'Fortis Memorial Research Institute',
        },
        {
          patientId: patientUser.id,
          type: 'LAB_REPORT',
          title: 'Annual Blood Work',
          description: 'Complete blood count normal. Lipid panel: Total cholesterol 195 mg/dL. HbA1c: 6.8% (improved). Kidney function normal.',
          date: '2024-01-15',
          doctorName: 'Dr. Ananya Gupta',
          hospitalName: 'AIIMS New Delhi',
        },
        {
          patientId: patientUser.id,
          type: 'IMAGING',
          title: 'Chest X-Ray',
          description: 'Routine chest X-ray. No abnormalities detected. Cardiac silhouette normal. Lungs clear.',
          date: '2024-06-30',
          doctorName: 'Dr. Vikram Malhotra',
          hospitalName: 'Medanta - The Medicity',
        },
      ],
    });
    console.log('Created medical records for patient');
  }

  // ---------------------------
  // 6. Past Emergency Requests
  // ---------------------------
  const existingEmergencies = await prisma.emergencyRequest.findMany({ where: { patientId: patientUser.id } });
  if (existingEmergencies.length === 0) {
    const emergency1 = await prisma.emergencyRequest.create({
      data: {
        id: 'emrg-1',
        patientId: patientUser.id,
        ambulanceId: 'amb-2',
        hospitalId: 'hosp-3',
        status: 'COMPLETED',
        severity: 3,
        description: 'Chest pain and shortness of breath. Suspected cardiac event.',
        patientLatitude: 28.6139,
        patientLongitude: 77.209,
        createdAt: new Date('2024-02-14T08:30:00Z'),
        updatedAt: new Date('2024-02-14T09:15:00Z'),
      },
    });

    await prisma.emergencyTimeline.createMany({
      data: [
        { emergencyId: emergency1.id, event: 'SOS_TRIGGERED', description: 'Patient triggered SOS', timestamp: '2024-02-14T08:30:00Z' },
        { emergencyId: emergency1.id, event: 'AMBULANCE_DISPATCHED', description: 'Ambulance DL01AB5678 dispatched', timestamp: '2024-02-14T08:32:00Z' },
        { emergencyId: emergency1.id, event: 'AMBULANCE_ARRIVED', description: 'Ambulance arrived at patient location', timestamp: '2024-02-14T08:48:00Z' },
        { emergencyId: emergency1.id, event: 'PATIENT_PICKED_UP', description: 'Patient loaded into ambulance', timestamp: '2024-02-14T08:52:00Z' },
        { emergencyId: emergency1.id, event: 'ARRIVED_AT_HOSPITAL', description: 'Arrived at AIIMS New Delhi', timestamp: '2024-02-14T09:10:00Z' },
        { emergencyId: emergency1.id, event: 'COMPLETED', description: 'Emergency resolved. Patient stable.', timestamp: '2024-02-14T09:15:00Z' },
      ],
    });

    const emergency2 = await prisma.emergencyRequest.create({
      data: {
        id: 'emrg-2',
        patientId: patientUser.id,
        ambulanceId: 'amb-10',
        hospitalId: 'hosp-3',
        status: 'COMPLETED',
        severity: 2,
        description: 'Severe hypoglycemia. Blood sugar dropped to 45 mg/dL.',
        patientLatitude: 28.5355,
        patientLongitude: 77.391,
        createdAt: new Date('2024-08-22T14:15:00Z'),
        updatedAt: new Date('2024-08-22T15:00:00Z'),
      },
    });

    await prisma.emergencyTimeline.createMany({
      data: [
        { emergencyId: emergency2.id, event: 'SOS_TRIGGERED', description: 'Patient triggered SOS', timestamp: '2024-08-22T14:15:00Z' },
        { emergencyId: emergency2.id, event: 'AMBULANCE_DISPATCHED', description: 'Ambulance DL01MN7890 dispatched', timestamp: '2024-08-22T14:17:00Z' },
        { emergencyId: emergency2.id, event: 'AMBULANCE_ARRIVED', description: 'Ambulance arrived at patient location', timestamp: '2024-08-22T14:30:00Z' },
        { emergencyId: emergency2.id, event: 'COMPLETED', description: 'Patient stabilized with glucose IV. Transported to AIIMS.', timestamp: '2024-08-22T15:00:00Z' },
      ],
    });

    const emergency3 = await prisma.emergencyRequest.create({
      data: {
        id: 'emrg-3',
        patientId: patientUser.id,
        ambulanceId: 'amb-1',
        hospitalId: 'hosp-6',
        status: 'COMPLETED',
        severity: 4,
        description: 'Hypertensive crisis. BP reading: 185/120 mmHg. Severe headache.',
        patientLatitude: 28.4595,
        patientLongitude: 77.0266,
        createdAt: new Date('2025-01-05T22:45:00Z'),
        updatedAt: new Date('2025-01-06T00:30:00Z'),
      },
    });

    await prisma.emergencyTimeline.createMany({
      data: [
        { emergencyId: emergency3.id, event: 'SOS_TRIGGERED', description: 'Patient triggered SOS', timestamp: '2025-01-05T22:45:00Z' },
        { emergencyId: emergency3.id, event: 'AMBULANCE_DISPATCHED', description: 'Ambulance DL01AB1234 dispatched', timestamp: '2025-01-05T22:47:00Z' },
        { emergencyId: emergency3.id, event: 'AMBULANCE_ARRIVED', description: 'Ambulance arrived at patient location', timestamp: '2025-01-05T23:02:00Z' },
        { emergencyId: emergency3.id, event: 'PATIENT_PICKED_UP', description: 'Patient loaded and IV antihypertensive administered', timestamp: '2025-01-05T23:06:00Z' },
        { emergencyId: emergency3.id, event: 'ARRIVED_AT_HOSPITAL', description: 'Arrived at Medanta - The Medicity', timestamp: '2025-01-05T23:28:00Z' },
        { emergencyId: emergency3.id, event: 'COMPLETED', description: 'BP stabilized. Patient admitted for observation.', timestamp: '2025-01-06T00:30:00Z' },
      ],
    });

    console.log('Created 3 past emergency requests with timelines');
  }

  // ---------------------------
  // 7. Notifications
  // ---------------------------
  const existingNotifs = await prisma.notification.findMany({ where: { userId: patientUser.id } });
  if (existingNotifs.length === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: patientUser.id,
          type: 'EMERGENCY',
          title: 'Emergency Resolved',
          message: 'Your emergency request from January 5 has been resolved. You were treated at Medanta - The Medicity.',
          isRead: true,
        },
        {
          userId: patientUser.id,
          type: 'SYSTEM',
          title: 'Profile Verified',
          message: 'Your LifeLink profile has been successfully verified. You can now access all features.',
          isRead: true,
        },
        {
          userId: patientUser.id,
          type: 'MEDICAL',
          title: 'Medication Reminder',
          message: 'Remember to take your Metformin 500mg with dinner today.',
          isRead: false,
        },
        {
          userId: patientUser.id,
          type: 'SYSTEM',
          title: 'Welcome to LifeLink',
          message: 'Welcome Arjun! Your emergency response profile is set up. Stay safe.',
          isRead: true,
        },
      ],
    });
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: driverUser.id,
        type: 'SYSTEM',
        title: 'Shift Starting',
        message: 'Your shift starts in 30 minutes. Please ensure the ambulance is ready.',
        isRead: false,
      },
      {
        userId: hospitalUser.id,
        type: 'SYSTEM',
        title: 'Welcome to LifeLink',
        message: 'Welcome Dr. Gupta! Your hospital staff account is active.',
        isRead: true,
      },
      {
        userId: adminUser.id,
        type: 'SYSTEM',
        title: 'System Status',
        message: 'All systems operational. 8 hospitals and 10 ambulances are registered.',
        isRead: false,
      },
    ],
  });

  console.log('Created notifications');
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
