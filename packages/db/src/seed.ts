import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { profiles, drivers, routes, trips, subscriptions } from '../schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  console.log('🌱 Starting Database Seeding...');

  try {
    // 1. Seed Admin
    console.log('👤 Seeding Admin...');
    await db.insert(profiles).values({
      id: '00000000-0000-0000-0000-000000000001',
      fullName: 'Super Admin',
      phone: '+9647800000000',
      role: 'admin',
    });

    // 2. Seed Students
    console.log('🎓 Seeding Students...');
    const studentIds = [
      '00000000-0000-0000-0001-000000000001',
      '00000000-0000-0000-0001-000000000002',
      '00000000-0000-0000-0001-000000000003',
      '00000000-0000-0000-0001-000000000004',
      '00000000-0000-0000-0001-000000000005',
    ];

    const studentNames = ['Ali Hussain', 'Fatima Ahmed', 'Omar Hassan', 'Zainab Kareem', 'Mustafa Salem'];
    const studentPhones = ['+9647800000011', '+9647800000012', '+9647800000013', '+9647800000014', '+9647800000015'];

    for (let i = 0; i < studentIds.length; i++) {
      await db.insert(profiles).values({
        id: studentIds[i],
        fullName: studentNames[i],
        phone: studentPhones[i],
        role: 'student',
      });
    }

    // 3. Seed Drivers
    console.log('🚗 Seeding Drivers...');
    const driver1Profile = {
      id: '00000000-0000-0000-0002-000000000001',
      fullName: 'Ahmed Driver',
      phone: '+9647800000001',
      role: 'driver',
    };
    const driver2Profile = {
      id: '00000000-0000-0000-0002-000000000002',
      fullName: 'Mohammed Transport',
      phone: '+9647800000002',
      role: 'driver',
    };
    const driver3Profile = {
      id: '00000000-0000-0000-0002-000000000003',
      fullName: 'Hussein Express',
      phone: '+9647800000003',
      role: 'driver',
    };

    await db.insert(profiles).values([driver1Profile, driver2Profile, driver3Profile]);

    const [driver1] = await db.insert(drivers).values({
      id: 'd0000000-0000-0000-0000-000000000001',
      userId: driver1Profile.id,
      licenseNumber: 'IQ-12345',
      vehicleModel: 'Hyundai Elantra 2024',
      vehiclePlate: '12345/Baghdad',
      capacity: 4,
      isVerified: true,
    }).returning();

    const [driver2] = await db.insert(drivers).values({
      id: 'd0000000-0000-0000-0000-000000000002',
      userId: driver2Profile.id,
      licenseNumber: 'IQ-67890',
      vehicleModel: 'Kia Sportage 2023',
      vehiclePlate: '67890/Baghdad',
      capacity: 6,
      isVerified: true,
    }).returning();

    const [driver3] = await db.insert(drivers).values({
      id: 'd0000000-0000-0000-0000-000000000003',
      userId: driver3Profile.id,
      licenseNumber: 'IQ-11111',
      vehicleModel: 'Toyota HiAce 2022',
      vehiclePlate: '11111/Baghdad',
      capacity: 12,
      isVerified: true,
    }).returning();

    // 4. Seed Routes
    console.log('🛣️ Seeding Routes...');
    const routeData = [
      {
        id: 'r0000000-0000-0000-0000-000000000001',
        driverId: driver1.id,
        title: 'Mansour to Baghdad University',
        startLocation: 'Al Mansour',
        endLocation: 'Baghdad University, Jadiriya',
        price: 50000,
        capacity: 4,
        availableSeats: 2,
        isActive: true,
      },
      {
        id: 'r0000000-0000-0000-0000-000000000002',
        driverId: driver1.id,
        title: 'Karrada to Mustansiriya University',
        startLocation: 'Al Karrada',
        endLocation: 'Mustansiriya University',
        price: 45000,
        capacity: 4,
        availableSeats: 4,
        isActive: true,
      },
      {
        id: 'r0000000-0000-0000-0000-000000000003',
        driverId: driver2.id,
        title: 'Zayouna to Technology University',
        startLocation: 'Al Zayouna',
        endLocation: 'University of Technology',
        price: 55000,
        capacity: 6,
        availableSeats: 3,
        isActive: true,
      },
      {
        id: 'r0000000-0000-0000-0000-000000000004',
        driverId: driver2.id,
        title: 'Sadr City to Al-Nahrain University',
        startLocation: 'Sadr City',
        endLocation: 'Al-Nahrain University, Kadhimiya',
        price: 40000,
        capacity: 6,
        availableSeats: 6,
        isActive: true,
      },
      {
        id: 'r0000000-0000-0000-0000-000000000005',
        driverId: driver3.id,
        title: 'Dora to Baghdad University (Express)',
        startLocation: 'Al Dora',
        endLocation: 'Baghdad University, Jadiriya',
        price: 60000,
        capacity: 12,
        availableSeats: 8,
        isActive: true,
      },
      {
        id: 'r0000000-0000-0000-0000-000000000006',
        driverId: driver3.id,
        title: 'Taji to University of Technology',
        startLocation: 'Al Taji',
        endLocation: 'University of Technology',
        price: 70000,
        capacity: 12,
        availableSeats: 0,
        isActive: false,
      },
    ];

    await db.insert(routes).values(routeData);

    // 5. Seed Trips
    console.log('🚌 Seeding Trips...');
    const tripData = [
      {
        id: 't0000000-0000-0000-0000-000000000001',
        routeId: routeData[0].id,
        driverId: driver1.id,
        status: 'driver_waiting',
        scheduledAt: new Date(),
        lastLat: '33.3152',
        lastLng: '44.3661',
      },
      {
        id: 't0000000-0000-0000-0000-000000000002',
        routeId: routeData[2].id,
        driverId: driver2.id,
        status: 'in_transit',
        scheduledAt: new Date(Date.now() - 3600000),
        startedAt: new Date(),
        lastLat: '33.2990',
        lastLng: '44.3740',
      },
      {
        id: 't0000000-0000-0000-0000-000000000003',
        routeId: routeData[4].id,
        driverId: driver3.id,
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 3600000),
      },
    ];

    await db.insert(trips).values(tripData);

    // 6. Seed Subscriptions
    console.log('📋 Seeding Subscriptions...');
    const subData = [
      {
        id: 's0000000-0000-0000-0000-000000000001',
        studentId: studentIds[0],
        routeId: routeData[0].id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 3600000),
      },
      {
        id: 's0000000-0000-0000-0000-000000000002',
        studentId: studentIds[1],
        routeId: routeData[0].id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 3600000),
      },
      {
        id: 's0000000-0000-0000-0000-000000000003',
        studentId: studentIds[2],
        routeId: routeData[2].id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 3600000),
      },
      {
        id: 's0000000-0000-0000-0000-000000000004',
        studentId: studentIds[3],
        routeId: routeData[3].id,
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 3600000),
      },
      {
        id: 's0000000-0000-0000-0000-000000000005',
        studentId: studentIds[4],
        routeId: routeData[1].id,
        status: 'expired',
        startDate: new Date(Date.now() - 60 * 24 * 3600000),
        endDate: new Date(Date.now() - 30 * 24 * 3600000),
      },
    ];

    await db.insert(subscriptions).values(subData);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.end();
  }
}

main();
