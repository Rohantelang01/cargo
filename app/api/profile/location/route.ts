
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const { driverId, coordinates } = await req.json();

    if (!driverId || !coordinates) {
      return NextResponse.json({ message: 'Driver ID and coordinates are required' }, { status: 400 });
    }

    const user = await User.findById(driverId);

    if (!user || !user.roles.includes('driver')) {
      return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    }

    if (user.driverInfo) {
        if (!user.driverInfo.currentLocation) {
            user.driverInfo.currentLocation = { coordinates: { type: 'Point', coordinates: [0,0]}};
        }
        user.driverInfo.currentLocation.coordinates.coordinates = [coordinates.lng, coordinates.lat];
        await user.save();
    } else {
        return NextResponse.json({ message: 'Driver info not found' }, { status: 404 });
    }


    return NextResponse.json({ message: 'Location updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
