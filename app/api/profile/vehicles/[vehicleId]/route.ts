import { NextRequest, NextResponse } from 'next/server';
import { Vehicle } from '@/models/Vehicle';
import { User } from '@/models/User';
import connectToDB from '@/lib/db';
import mongoose from 'mongoose';
import { getTokenFromCookies } from '@/lib/auth'; // Assuming you have this helper

// GET a specific vehicle
export async function GET(request: NextRequest, { params }: { params: { vehicleId: string } }) {
    try {
        await connectToDB();
        const userId = await getTokenFromCookies(request);

        const vehicle = await Vehicle.findOne({ _id: params.vehicleId, owner: userId }).lean();

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found or you are not the owner' }, { status: 404 });
        }
        return NextResponse.json(vehicle);
    } catch (error) {
        // ... (Error handling)
    }
}


// UPDATE a specific vehicle
export async function PUT(request: NextRequest, { params }: { params: { vehicleId: string } }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await connectToDB();
        const userId = await getTokenFromCookies(request);
        const data = await request.json();

        // Ensure owner cannot be changed
        delete data.owner;
        
        const vehicle = await Vehicle.findOne({ _id: params.vehicleId, owner: userId }).session(session);

        if (!vehicle) {
            await session.abortTransaction();
            return NextResponse.json({ error: 'Vehicle not found or you do not have permission' }, { status: 404 });
        }

        // If the vehicle becomes self-driven, update the user model
        if (data.selfDriven && !vehicle.selfDriven) {
            const user = await User.findById(userId).session(session);
            // This assumes a license is provided when making a vehicle self-driven
            if (data.licenseData) {
                user.driverInfo.licenses.push(data.licenseData);
                if (!user.roles.includes('driver')) {
                    user.roles.push('driver');
                }
                await user.save({ session });
            }
            vehicle.assignedDriver = userId;
        }

        Object.assign(vehicle, data);
        await vehicle.save({ session });
        
        await session.commitTransaction();
        return NextResponse.json({ success: true, vehicle });

    } catch (error) {
        await session.abortTransaction();
        // ... (Error handling)
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

    } catch (error) {
        await session.abortTransaction();
        // ... (Error handling)
    } finally {
        session.endSession();
    }
}
