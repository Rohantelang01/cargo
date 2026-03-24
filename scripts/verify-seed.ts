import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import mongoose from 'mongoose';
import connectToDB from '../lib/db';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';

async function verify() {
  await connectToDB();
  const demoUsersCount = await User.countDocuments({ email: /demo.*@cargo.com/ });
  const demoVehiclesCount = await Vehicle.countDocuments({ plateNumber: /MH34DM/ });
  const demoBookingsCount = await Booking.countDocuments({ status: 'COMPLETED', fare: { $exists: true } });

  console.log('Demo Users Count:', demoUsersCount);
  console.log('Demo Vehicles Count:', demoVehiclesCount);
  console.log('Completed Bookings Count:', demoBookingsCount);

  const sampleUser = await User.findOne({ email: 'demo0@cargo.com' }).populate('wallet');
  console.log('Sample User Wallet Balance:', sampleUser?.wallet ? (sampleUser.wallet as any).addedBalance : 'No Wallet');

  await mongoose.connection.close();
}

verify().catch(console.error);
