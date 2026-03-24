import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, LicenseType, VehicleCategory } from '../models/User';
import { Vehicle } from '../models/Vehicle';
import { Wallet } from '../models/Wallet';
import { Booking } from '../models/Booking';
import { BookingRequest } from '../models/BookingRequest';
import { Trip } from '../models/Trip';
import { Review } from '../models/Review';
import { Notification } from '../models/Notification';
import connectToDB from '../lib/db';

// ══════════════════════════════════════════════════════════════
// CHANDRAPUR LOCATIONS
// ══════════════════════════════════════════════════════════════

const locations = [
  { place: 'Chandrapur',  tehsil: 'Chandrapur', district: 'Chandrapur', pincode: '442401', lat: 19.9500, lng: 79.3000 },
  { place: 'Warora',      tehsil: 'Warora',      district: 'Chandrapur', pincode: '442907', lat: 20.2286, lng: 78.9995 },
  { place: 'Bhadrawati',  tehsil: 'Bhadrawati',  district: 'Chandrapur', pincode: '442902', lat: 20.1032, lng: 79.1308 },
  { place: 'Ballarpur',   tehsil: 'Ballarpur',   district: 'Chandrapur', pincode: '442701', lat: 19.8398, lng: 79.3554 },
  { place: 'Rajura',      tehsil: 'Rajura',      district: 'Chandrapur', pincode: '442905', lat: 19.7786, lng: 79.3648 },
  { place: 'Mul',         tehsil: 'Mul',         district: 'Chandrapur', pincode: '441224', lat: 20.0697, lng: 79.6736 },
  { place: 'Nagbhir',     tehsil: 'Nagbhir',     district: 'Chandrapur', pincode: '441205', lat: 20.5595, lng: 79.8016 },
  { place: 'Sindewahi',   tehsil: 'Sindewahi',   district: 'Chandrapur', pincode: '441222', lat: 20.3683, lng: 79.6587 },
  { place: 'Brahmapuri',  tehsil: 'Brahmapuri',  district: 'Chandrapur', pincode: '441206', lat: 20.6276, lng: 79.8561 },
  { place: 'Chimur',      tehsil: 'Chimur',      district: 'Chandrapur', pincode: '442903', lat: 20.4859, lng: 79.3582 },
];

const rI = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const rF = (a: number, b: number) => parseFloat((Math.random() * (b - a) + a).toFixed(6));
const rEl = <T>(arr: T[]): T => arr[rI(0, arr.length - 1)];

const IMG = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

const mkAddr = (l: typeof locations[0]) => ({
  addressLine1: `Main Road, ${l.place}`,
  village: l.place,
  tehsil: l.tehsil,
  district: l.district,
  state: 'Maharashtra',
  pincode: l.pincode,
  coordinates: { lat: l.lat, lng: l.lng },
});

const mkGeo = (l: typeof locations[0]) => ({
  type: 'Point' as const,
  coordinates: [l.lng + rF(-0.01, 0.01), l.lat + rF(-0.01, 0.01)] as [number, number],
});

const mkLoc = (l: typeof locations[0]) => ({
  address: `${l.place}, Chandrapur, Maharashtra`,
  coordinates: { lat: l.lat + rF(-0.005, 0.005), lng: l.lng + rF(-0.005, 0.005) },
});

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

async function upsertUser(data: any) {
  let user = await User.findOne({ email: data.email });
  if (user) {
    Object.assign(user, data);
    await user.save();
  } else {
    user = new User({ ...data, password: 'password123' });
    await user.save();
  }
  
  // Wallet creation if not exists
  let wallet = await Wallet.findOne({ user: user._id });
  if (!wallet) {
    wallet = new Wallet({ 
      user: user._id, 
      addedBalance: 50000, 
      generatedBalance: 5000, 
      rentalBalance: 0,
      transactions: [{
        amount: 50000,
        type: 'CREDIT',
        walletType: 'ADDED',
        status: 'COMPLETED',
        description: 'Demo Seed Initial Balance',
        timestamp: new Date()
      }]
    });
    await wallet.save();
    user.wallet = wallet._id;
    await user.save();
  }
  return user;
}

async function createDemoVehicle(ownerId: any, driverId: any | null, selfDriven: boolean, type: VehicleCategory, locIdx: number) {
  const plate = `MH34DM${String(rI(1000, 9999))}`;
  const existing = await Vehicle.findOne({ plateNumber: plate });
  if (existing) return existing;

  const makes: Record<VehicleCategory, string[]> = {
    car: ['Maruti', 'Hyundai', 'Tata'],
    bike: ['Hero', 'Honda', 'Bajaj'],
    truck: ['Tata', 'Mahindra', 'Ashok Leyland'],
    auto: ['Bajaj', 'Piaggio'],
    bus: ['Tata', 'Force']
  };

  const models: Record<VehicleCategory, string[]> = {
    car: ['Swift', 'Creta', 'Nexon'],
    bike: ['Splendor', 'Activa', 'Pulsar'],
    truck: ['Ace', 'Bolero Pik-up', 'Dost'],
    auto: ['RE', 'Ape'],
    bus: ['Starbus', 'Traveller']
  };

  const licMap: Record<VehicleCategory, LicenseType> = {
    car: 'LMV',
    bike: 'MCG',
    truck: 'HGV',
    auto: '3W-T',
    bus: 'HPMV'
  };

  return Vehicle.create({
    owner: ownerId,
    assignedDriver: driverId || undefined,
    selfDriven,
    make: rEl(makes[type]),
    model: rEl(models[type]),
    year: rI(2018, 2024),
    color: rEl(['White', 'Silver', 'Black', 'Blue']),
    plateNumber: plate,
    vehicleType: type,
    requiredLicense: licMap[type],
    seatingCapacity: type === 'bus' ? 20 : (type === 'car' ? 5 : (type === 'auto' ? 3 : 2)),
    perKmRate: type === 'truck' ? 20 : (type === 'car' ? 12 : (type === 'bike' ? 5 : 10)),
    status: 'AVAILABLE',
    rcDocument: IMG,
    insurance: IMG,
    currentLocation: mkGeo(locations[locIdx]),
    rating: rF(4, 5),
    totalTrips: rI(10, 50),
  });
}

const seed = async () => {
  await connectToDB();
  console.log('🚀 Starting Demo Seed (Chandrapur Matrix)...');

  const demoUsers: any[] = [];
  const roles: ('passenger' | 'driver' | 'owner')[] = ['passenger', 'driver', 'owner'];

  // 1. Create 10 Users
  for (let i = 0; i < 10; i++) {
    const loc = locations[i];
    const user = await upsertUser({
      name: `Demo User ${i}`,
      email: `demo${i}@cargo.com`,
      phone: `900000000${i}`,
      age: rI(25, 45),
      gender: i % 2 === 0 ? 'male' : 'female',
      roles: ['passenger', 'driver', 'owner'],
      status: 'ONLINE',
      permanentAddress: mkAddr(loc),
      currentLocation: mkGeo(loc),
      verification: {
        isAadhaarVerified: true,
        isPanVerified: true,
        aadhaarNumber: `12345678901${i}`,
        panNumber: `ABCDE123${i}F`,
        isSelfieVerified: true,
        selfieImage: IMG,
        verifiedAt: new Date(),
      },
      driverInfo: {
        licenses: [
          { licenseType: 'LMV', licenseNumber: `MH34L${i}001`, licenseImage: IMG, vehicleCategory: 'car', hourlyRate: 150, isActive: true, isVerified: true },
          { licenseType: 'MCG', licenseNumber: `MH34M${i}002`, licenseImage: IMG, vehicleCategory: 'bike', hourlyRate: 80, isActive: true, isVerified: true },
        ],
        status: 'AVAILABLE',
        rating: 4.8,
        totalTrips: 25,
        idProof: IMG,
      },
      publicInfo: {
        rating: 4.9,
        totalTrips: 30,
        memberSince: new Date(2024, 0, 1),
        bio: `Hi, I am Demo User ${i} from ${loc.place}. Multipurpose user for Cargo demo!`,
        languages: ['English', 'Marathi', 'Hindi'],
      },
      isActive: true,
      isBanned: false,
    });
    demoUsers.push(user);
    console.log(`✅ Created User: ${user.email}`);
  }

  // 2. Create Vehicles for each user
  const allVehicles: any[] = [];
  for (let i = 0; i < 10; i++) {
    const user = demoUsers[i];
    // Each user owns: 1 Self-driven Car, 1 Bike (assigned to next user), 1 Truck (Available)
    const selfCar = await createDemoVehicle(user._id, user._id, true, 'car', i);
    const bike = await createDemoVehicle(user._id, demoUsers[(i + 1) % 10]._id, false, 'bike', i);
    const truck = await createDemoVehicle(user._id, null, false, 'truck', i);
    
    user.ownerInfo = { vehicles: [selfCar._id, bike._id, truck._id], rating: 4.9, totalTrips: 20 };
    user.driverInfo.linkedVehicleId = selfCar._id;
    await user.save();
    
    allVehicles.push(selfCar, bike, truck);
    console.log(`🚗 Created Vehicles for ${user.email}`);
  }

  // 3. Create interlinked Trips
  console.log('⏳ Generating interactions...');
  for (let i = 0; i < 10; i++) {
    const passenger = demoUsers[i];
    const driver = demoUsers[(i + 1) % 10]; // User 1 drives for User 0
    const owner = demoUsers[(i + 2) % 10];  // User 2 owns the vehicle
    const vehicle = allVehicles.find(v => v.owner.toString() === owner._id.toString() && !v.selfDriven);

    if (!vehicle) continue;

    // A. Completed Trip
    const fare = {
      driverHourlyRate: 100, vehiclePerKmRate: 10, licenseUsed: 'LMV' as LicenseType,
      estimatedDuration: 1, estimatedDistance: 10, estimatedFare: 200,
      platformFee: 10, platformFeePerKm: 1, isComboTrip: false
    };

    const booking = await Booking.create({
      passenger: passenger._id, driver: driver._id, owner: owner._id, vehicle: vehicle._id,
      bookingType: 'SCHEDULED', status: 'COMPLETED',
      passengers: 1, vehicleType: vehicle.vehicleType,
      pickup: mkLoc(locations[i]), dropoff: mkLoc(locations[(i + 3) % 10]),
      fare, payment: { method: 'WALLET', status: 'PAID', amount: 200 },
      tripData: { 
        startTime: new Date(Date.now() - 86400000), 
        endTime: new Date(Date.now() - 86400000 + 3600000),
        actualDistance: 10, actualDuration: 1
      }
    });

    await Review.create({ bookingId: booking._id, reviewerId: passenger._id, revieweeId: driver._id, rating: 5, comment: 'Excellent service!', reviewType: 'passenger_to_driver', isPublic: true });
    await Review.create({ bookingId: booking._id, reviewerId: driver._id, revieweeId: passenger._id, rating: 5, comment: 'Great passenger.', reviewType: 'driver_to_passenger', isPublic: true });

    // B. Started Trip (Active) for Demo User 0 (as Driver)
    if (i === 0) {
      const activeBooking = await Booking.create({
        passenger: demoUsers[5]._id, driver: passenger._id, owner: passenger._id, vehicle: allVehicles[0]._id, // self car
        bookingType: 'INSTANT', status: 'STARTED',
        passengers: 1, vehicleType: 'car',
        pickup: mkLoc(locations[0]), dropoff: mkLoc(locations[5]),
        fare, payment: { method: 'WALLET', status: 'PENDING', amount: 200 },
        tripData: { startTime: new Date() }
      });
      await Trip.create({
        bookingId: activeBooking._id,
        liveTracking: {
          isActive: true,
          currentLocation: { lat: locations[0].lat + 0.01, lng: locations[0].lng + 0.01, timestamp: new Date() },
          route: [{ lat: locations[0].lat, lng: locations[0].lng, timestamp: new Date(), speed: 40 }]
        }
      });
      console.log('📍 Created Active Trip for demo0@cargo.com');
    }

    // C. Notification
    await Notification.create({
      userId: passenger._id,
      type: 'trip_completed',
      title: 'Trip Done!',
      message: `Aapki Chandrapur trip complete hui.`,
      isRead: false
    });

    // D. Booking Request (Pending)
    const reqPassenger = demoUsers[(i + 4) % 10];
    const reqBooking = await Booking.create({
      passenger: reqPassenger._id, bookingType: 'INSTANT', status: 'REQUESTED',
      passengers: 1, vehicleType: 'car',
      pickup: mkLoc(locations[(i + 4) % 10]), dropoff: mkLoc(locations[(i + 6) % 10]),
      fare: { ...fare, estimatedFare: 250 },
    });

    await BookingRequest.create({
      booking: reqBooking._id,
      passenger: reqPassenger._id,
      pair: { driver: passenger._id, owner: passenger._id, vehicle: allVehicles[i * 3]._id, isCombo: true },
      driverResponse: 'PENDING',
      ownerResponse: 'NA',
      status: 'PENDING',
      estimatedFare: 250,
      distanceKm: 12,
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 600000),
      requestType: 'instant'
    });
  }

  console.log(`
  ╔══════════════════════════════════════════════╗
  ║    ✅ 10 DEMO USERS SEED COMPLETE!          ║
  ╠══════════════════════════════════════════════╣
  ║  Users: demo0 - demo9 @cargo.com             ║
  ║  Password: password123                       ║
  ║  District: Chandrapur                        ║
  ║  Interactions: Trips, Reviews, Wallet        ║
  ╚══════════════════════════════════════════════╝
  `);

  await mongoose.connection.close();
};

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  mongoose.connection.close();
});
