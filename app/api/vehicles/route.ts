import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner');
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await User.findById(decoded.id); // ← fix
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const vehicles = await Vehicle.find({ owner: ownerId }).sort({ createdAt: -1 });
      
      return NextResponse.json({ 
        success: true, 
        vehicles: vehicles.map(vehicle => ({
          ...vehicle.toObject(),
          _id: vehicle._id.toString()
        }))
      });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.id); // ← fix
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const vehicle = new Vehicle({
        ...body,
        owner: user._id
      });

      await vehicle.save();

      if (!user.ownerInfo) {
        user.ownerInfo = { vehicles: [] };
      }
      user.ownerInfo.vehicles.push(vehicle._id.toString());

      if (!user.roles.includes('owner')) {
        user.roles.push('owner');
      }

      await user.save();

      return NextResponse.json({ 
        success: true, 
        vehicle: {
          ...vehicle.toObject(),
          _id: vehicle._id.toString()
        }
      });
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}