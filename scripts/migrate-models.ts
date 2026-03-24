import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Vehicle } from '@/models/Vehicle';
import { Wallet } from '@/models/Wallet';
import { Booking } from '@/models/Booking';
import { BookingRequest } from '@/models/BookingRequest';

/**
 * Migration script to update existing models with new fields
 * This script adds default values for new fields to maintain backward compatibility
 */

async function migrateUsers() {
  console.log('🔄 Migrating Users...');
  
  const users = await User.find({});
  
  for (const user of users) {
    let needsUpdate = false;
    
    // Add request tracking fields
    if (user.requestCount === undefined) {
      user.requestCount = 0;
      needsUpdate = true;
    }
    
    if (user.maxRequestsPerDay === undefined) {
      user.maxRequestsPerDay = 10;
      needsUpdate = true;
    }
    
    // Add penalty system fields
    if (user.redCards === undefined) {
      user.redCards = 0;
      needsUpdate = true;
    }
    
    if (user.warnings === undefined) {
      user.warnings = 0;
      needsUpdate = true;
    }
    
    // Initialize empty arrays if they don't exist
    if (!user.penaltyHistory) {
      user.penaltyHistory = [];
      needsUpdate = true;
    }
    
    if (!user.rentalHistory) {
      user.rentalHistory = [];
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      await user.save();
      console.log(`✅ Updated user: ${user.name} (${user.email})`);
    }
  }
  
  console.log(`✅ Users migration completed. Processed ${users.length} users.`);
}

async function migrateVehicles() {
  console.log('🔄 Migrating Vehicles...');
  
  const vehicles = await Vehicle.find({});
  
  for (const vehicle of vehicles) {
    let needsUpdate = false;
    
    // Add rental system fields
    if (vehicle.isRented === undefined) {
      vehicle.isRented = false;
      needsUpdate = true;
    }
    
    if (vehicle.maintenanceMode === undefined) {
      vehicle.maintenanceMode = false;
      needsUpdate = true;
    }
    
    // Initialize empty arrays if they don't exist
    if (!vehicle.rentalHistory) {
      vehicle.rentalHistory = [];
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      await vehicle.save();
      console.log(`✅ Updated vehicle: ${vehicle.plateNumber} (${vehicle.make} ${vehicle.model})`);
    }
  }
  
  console.log(`✅ Vehicles migration completed. Processed ${vehicles.length} vehicles.`);
}

async function migrateWallets() {
  console.log('🔄 Migrating Wallets...');
  
  const wallets = await Wallet.find({});
  
  for (const wallet of wallets) {
    let needsUpdate = false;
    
    // Add rental balance field
    if (wallet.rentalBalance === undefined) {
      wallet.rentalBalance = 0;
      needsUpdate = true;
    }
    
    if (wallet.withdrawableBalance === undefined) {
      wallet.withdrawableBalance = wallet.generatedBalance || 0;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      await wallet.save();
      console.log(`✅ Updated wallet for user: ${wallet.user}`);
    }
  }
  
  console.log(`✅ Wallets migration completed. Processed ${wallets.length} wallets.`);
}

async function migrateBookings() {
  console.log('🔄 Migrating Bookings...');
  
  const bookings = await Booking.find({});
  
  for (const booking of bookings) {
    let needsUpdate = false;
    
    // Add request tracking fields
    if (booking.requestCount === undefined) {
      booking.requestCount = 0;
      needsUpdate = true;
    }
    
    if (booking.maxRequestsPerDay === undefined) {
      booking.maxRequestsPerDay = 10;
      needsUpdate = true;
    }
    
    // Update platform fee structure for existing bookings
    if (booking.fare && booking.fare.platformFeePerKm === undefined) {
      // For existing bookings, calculate per-km fee from fixed fee
      const distance = booking.estimatedDistance || 0;
      if (distance > 0) {
        booking.fare.platformFeePerKm = Math.round(booking.fare.platformFee / distance);
        booking.fare.platformFee = booking.fare.platformFee; // Keep original value
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      await booking.save();
      console.log(`✅ Updated booking: ${booking._id}`);
    }
  }
  
  console.log(`✅ Bookings migration completed. Processed ${bookings.length} bookings.`);
}

async function migrateBookingRequests() {
  console.log('🔄 Migrating BookingRequests...');
  
  const bookingRequests = await BookingRequest.find({});
  
  for (const request of bookingRequests) {
    let needsUpdate = false;
    
    // Add request management fields
    if (request.dailyRequestCount === undefined) {
      request.dailyRequestCount = 0;
      needsUpdate = true;
    }
    
    if (request.penaltyApplied === undefined) {
      request.penaltyApplied = false;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      await request.save();
      console.log(`✅ Updated booking request: ${request._id}`);
    }
  }
  
  console.log(`✅ BookingRequests migration completed. Processed ${bookingRequests.length} requests.`);
}

async function runMigration() {
  try {
    console.log('🚀 Starting model migration...');
    console.log('=====================================');
    
    await dbConnect();
    
    // Run all migrations
    await migrateUsers();
    await migrateVehicles();
    await migrateWallets();
    await migrateBookings();
    await migrateBookingRequests();
    
    console.log('=====================================');
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration };
