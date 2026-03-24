import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Booking } from '@/models/Booking';
import { User } from '@/models/User';
import { Vehicle } from '@/models/Vehicle';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await dbConnect();

    const {
      passengerId,
      driverId,
      vehicleId,
      pickup,
      dropoff,
      bookingType,
      fareDetails, // Contains pre-calculated fare info
      scheduledDateTime: bookingTime
    } = await req.json();

    if (!passengerId || !driverId || !vehicleId || !pickup || !dropoff || !bookingType || !fareDetails) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [passenger, driver, vehicle] = await Promise.all([
        User.findById(passengerId).session(session),
        User.findById(driverId).session(session),
        Vehicle.findById(vehicleId).session(session),
    ]);
    
    if (!passenger) return NextResponse.json({ message: 'Passenger not found' }, { status: 404 });
    if (!driver) return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    if (!vehicle) return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });

    const matchingLicense = driver.driverInfo.licenses.find(
      l => l.licenseType === vehicle.requiredLicense && l.isActive
    );

    if (!matchingLicense) {
        return NextResponse.json({ message: 'Driver does not have a valid license for this vehicle type.' }, { status: 400 });
    }
    
    const status = bookingType === 'advance' ? 'requested' : 'accepted';
    const scheduledDateTime = bookingType === 'advance' ? new Date(bookingTime) : new Date();

    const newBooking = new Booking({
      passenger: passengerId,
      driver: driverId,
      owner: vehicle.owner,
      vehicle: vehicleId,
      pickup,
      dropoff,
      bookingType,
      scheduledDateTime,
      status,
      fare: {
        driverHourlyRate: matchingLicense.hourlyRate,
        vehiclePerKmRate: vehicle.perKmRate,
        licenseUsed: matchingLicense.licenseType,
        estimatedDuration: fareDetails.estimatedDuration,
        estimatedDistance: fareDetails.estimatedDistance,
        estimatedFare: fareDetails.estimatedFare,
        platformFee: fareDetails.platformFee || 2,
        isComboTrip: vehicle.owner.equals(driver._id),
      },
      tripData: {
          // Initial empty values
          route: [],
      }
    });

    await newBooking.save({ session });
    
    if (bookingType === 'instant') {
        driver.driverInfo.status = 'ON_TRIP';
        vehicle.isAvailable = false;
        await Promise.all([
            driver.save({ session }),
            vehicle.save({ session })
        ]);
    }

    await session.commitTransaction();

    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  } finally {
    session.endSession();
  }
}
