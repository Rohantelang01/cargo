import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import mongoose from 'mongoose';
import connectToDB from '../lib/db';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

async function debug() {
  try {
    await connectToDB();
    console.log('Connected to DB');

    // Find a test user (replace with actual test user ID if needed, or find first user)
    // We try to find a user who is not already a driver to test the role addition logic
    const user = await User.findOne({ email: /@/ });
    if (!user) {
      console.error('No user found to test with');
      process.exit(1);
    }
    console.log('Testing with user:', user.email, user._id);

    const vehicleData = {
      make: "Debug",
      model: "Script",
      year: 2024,
      color: "Black",
      plateNumber: "DEBUG-" + Date.now(),
      vehicleType: "car",
      seatingCapacity: 4,
      perKmRate: 15,
      requiredLicense: "LMV",
      selfDriven: true,
      isAvailable: true
    };

    const licenseData = {
      licenseType: "LMV",
      licenseNumber: "DEBUGLIC" + Math.floor(Math.random() * 100000),
      hourlyRate: 150,
      expiryDate: "2030-01-01"
    };

    console.log('Creating vehicle...');
    const newVehicle = new Vehicle({
      ...vehicleData,
      status: vehicleData.isAvailable ? 'AVAILABLE' : 'OFFLINE',
      owner: user._id,
      currentLocation: { type: 'Point', coordinates: [0, 0] }
    });

    console.log('Saving vehicle...');
    await newVehicle.save();
    console.log('Vehicle saved:', newVehicle._id);

    console.log('Updating user...');
    // Refetch user to ensure we have fresh data
    const freshUser = await User.findById(user._id);
    if (!freshUser) throw new Error('User lost!');

    if (!freshUser.ownerInfo) freshUser.ownerInfo = { vehicles: [] };
    freshUser.ownerInfo.vehicles.push(newVehicle._id as any);
    if (!freshUser.roles.includes('owner')) freshUser.roles.push('owner');

    if (vehicleData.selfDriven && licenseData) {
      if (!freshUser.driverInfo) freshUser.driverInfo = { licenses: [], status: 'OFFLINE', rating: 0, totalTrips: 0 };
      
      const processedLicense = {
        licenseType: licenseData.licenseType,
        licenseNumber: licenseData.licenseNumber,
        licenseImage: 'https://via.placeholder.com/150',
        vehicleCategory: 'car',
        hourlyRate: licenseData.hourlyRate,
        expiryDate: new Date(licenseData.expiryDate),
        isActive: true,
      };
      
      freshUser.driverInfo.licenses.push(processedLicense as any);
      if (!freshUser.roles.includes('driver')) freshUser.roles.push('driver');
      freshUser.driverInfo.linkedVehicleId = newVehicle._id as any;
    }

    console.log('Final User roles:', freshUser.roles);
    await freshUser.save();
    console.log('User updated successfully');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('DEBUG ERROR:', error);
    if (error.errors) {
        console.error('Validation Errors Details:', JSON.stringify(error.errors, null, 2));
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

debug();
