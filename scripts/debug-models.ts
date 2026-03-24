import mongoose from 'mongoose';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { BookingRequest } from '../models/BookingRequest';

async function test() {
  console.log('User model:', typeof User);
  console.log('Booking model:', typeof Booking);
  console.log('BookingRequest model:', typeof BookingRequest);
}

test().catch(console.error);
