import { NextRequest, NextResponse } from 'next/server';
import { Vehicle } from '@/models/Vehicle';
import { User } from '@/models/User';
import connectToDB from '@/lib/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const getTokenFromCookies = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// GET a specific vehicle
export async function GET(request: NextRequest, { params }: { params: { vehicleId: string } }) {
    try {
        await connectToDB();
        const userId = await getTokenFromCookies(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vehicle = await Vehicle.findOne({ _id: params.vehicleId, owner: userId }).lean();

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found or you are not the owner' }, { status: 404 });
        }
        return NextResponse.json(vehicle);
    } catch (error: any) {
        console.error('Error fetching vehicle:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicle', details: error.message }, { status: 500 });
    }
}


// UPDATE a specific vehicle
export async function PUT(request: NextRequest, { params }: { params: { vehicleId: string } }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await connectToDB();
        const userId = await getTokenFromCookies(request);

        if (!userId) {
            await session.abortTransaction();
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Ensure owner cannot be changed
        delete data.owner;
        
        const vehicle = await Vehicle.findOne({ _id: params.vehicleId, owner: userId }).session(session);

        if (!vehicle) {
            await session.abortTransaction();
            return NextResponse.json({ error: 'Vehicle not found or you do not have permission' }, { status: 404 });
        }

        // Handle isAvailable to status conversion
        if (data.isAvailable !== undefined) {
            data.status = data.isAvailable ? 'AVAILABLE' : 'OFFLINE';
            delete data.isAvailable;
        }

        // Update vehicle fields
        Object.assign(vehicle, data);
        await vehicle.save({ session });
        
        await session.commitTransaction();
        return NextResponse.json({ success: true, vehicle });

    } catch (error: any) {
        await session.abortTransaction();
        console.error('Error updating vehicle:', error);
        return NextResponse.json({ 
            error: 'Failed to update vehicle', 
            details: error.message 
        }, { status: 500 });
    } finally {
        session.endSession();
    }
}

// DELETE a specific vehicle
export async function DELETE(request: NextRequest, { params }: { params: { vehicleId: string } }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await connectToDB();
        const userId = await getTokenFromCookies(request);

        if (!userId) {
            await session.abortTransaction();
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vehicle = await Vehicle.findOne({ _id: params.vehicleId, owner: userId });

        if (!vehicle) {
            await session.abortTransaction();
            return NextResponse.json({ error: 'Vehicle not found or you do not have permission' }, { status: 404 });
        }

        // You might want to add checks here, e.g., cannot delete if there are active bookings

        await Vehicle.deleteOne({ _id: params.vehicleId, owner: userId }).session(session);

        // Also remove the reference from the user's ownerInfo.vehicles array if you are still using it.
        // Note: The new model summary doesn't explicitly mention ownerInfo, but if it exists, it should be updated.
        // await User.findByIdAndUpdate(userId, { $pull: { 'ownerInfo.vehicles': params.vehicleId } }).session(session);

        await session.commitTransaction();
        return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' });

    } catch (error: any) {
        await session.abortTransaction();
        console.error('Error deleting vehicle:', error);
        return NextResponse.json({ 
            error: 'Failed to delete vehicle', 
            details: error.message 
        }, { status: 500 });
    } finally {
        session.endSession();
    }
}
