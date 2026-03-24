import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { Vehicle } from '@/models/Vehicle';
import connectToDB from '@/lib/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function getTokenFromRequest(req: NextRequest): Promise<string> {
  const tokenCookie = (await cookies()).get('token');
  if (tokenCookie) {
    const token = tokenCookie.value;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT secret is not configured');
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT secret is not configured');
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  }

  throw new Error('Authentication token not found');
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const userId = await getTokenFromRequest(req);
    const user = await User.findById(userId)
      .select('-password')
      .populate('wallet')
      .populate({ 
        path: 'ownerInfo.vehicles', 
        select: 'selfDriven vehicleType make model status plateNumber perKmRate isAvailable' 
      });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch profile', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const userId = await getTokenFromRequest(req);
    const updateData = await req.json();

    const allowedFields = ['name', 'phone', 'age', 'gender', 'profileImage', 'permanentAddress'];
    const filteredData: any = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) filteredData[field] = updateData[field];
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    Object.assign(user, filteredData);
    await user.save();

    const updatedUser = await User.findById(userId).select('-password').populate('wallet');
    return NextResponse.json(updatedUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update profile', details: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectToDB();
    const userId = await getTokenFromRequest(request);
    const { section, data } = await request.json();

    if (!section || !data) {
      await session.abortTransaction();
      return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // --- Vehicle Registration ---
    if (section === 'vehicleRegistration') {
      const { vehicleData, licenseData } = data;

      if (!vehicleData) {
        await session.abortTransaction();
        return NextResponse.json({ error: 'Vehicle data is required' }, { status: 400 });
      }

      console.log('Creating vehicle with data:', JSON.stringify(vehicleData, null, 2));

      let newVehicle;
      try {
        newVehicle = new Vehicle({
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          plateNumber: vehicleData.plateNumber,
          vehicleType: vehicleData.vehicleType,
          seatingCapacity: vehicleData.seatingCapacity,
          perKmRate: vehicleData.perKmRate,
          rcDocument: vehicleData.rcDocument || '',
          insurance: vehicleData.insurance || '',
          isAvailable: vehicleData.isAvailable ?? true,
          requiredLicense: vehicleData.requiredLicense,
          selfDriven: vehicleData.selfDriven ?? false,
          owner: userId,
          currentLocation: vehicleData.currentLocation || {
            type: 'Point',
            coordinates: [0, 0]
          }
        });
        
        console.log('Vehicle object created:', JSON.stringify(newVehicle, null, 2));
        await newVehicle.save({ session });
        console.log('Vehicle saved successfully');

      } catch (error) {
        console.error('Error creating vehicle:', error);
        await session.abortTransaction();
        return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
      }

      if (!newVehicle) {
        await session.abortTransaction();
        return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
      }

      if (!user.ownerInfo) user.ownerInfo = { vehicles: [] };
      user.ownerInfo.vehicles.push(newVehicle._id);

      if (!user.roles.includes('owner')) user.roles.push('owner');

      if (vehicleData.selfDriven && licenseData) {
        if (!user.driverInfo) user.driverInfo = { licenses: [] };
        
        const LICENSE_VEHICLE_MAP: Record<string, string> = {
          'MCWOG': 'bike', 'MCG': 'bike',
          '3W-NT': 'auto', '3W-T': 'auto',
          'LMV-NT': 'car', 'LMV': 'car',
          'HMV': 'truck', 'HPMV': 'bus', 'HGV': 'truck'
        };
        
        const existingLicenseIndex = user.driverInfo?.licenses?.findIndex(
          (license: any) => license.licenseType === licenseData.licenseType
        );
        
        if (existingLicenseIndex !== -1) {
          user.driverInfo.licenses[existingLicenseIndex] = {
            licenseType: licenseData.licenseType,
            licenseNumber: licenseData.licenseNumber,
            licenseImage: licenseData.licenseImage || '',
            vehicleCategory: LICENSE_VEHICLE_MAP[licenseData.licenseType],
            hourlyRate: licenseData.hourlyRate,
            expiryDate: licenseData.expiryDate,
            isActive: true,
          };
        } else {
          user.driverInfo.licenses.push({
            licenseType: licenseData.licenseType,
            licenseNumber: licenseData.licenseNumber,
            licenseImage: licenseData.licenseImage || '',
            vehicleCategory: LICENSE_VEHICLE_MAP[licenseData.licenseType],
            hourlyRate: licenseData.hourlyRate,
            expiryDate: licenseData.expiryDate,
            isActive: true,
          });
        }
        
        newVehicle.assignedDriver = user._id;
        await newVehicle.save({ session });

        if (!user.roles.includes('driver')) user.roles.push('driver');
        user.driverInfo.linkedVehicleId = newVehicle._id;
      }

    // --- Driver License ---
    } else if (section === 'driverLicense') {
      const { licenseData } = data;
      if (!user.driverInfo) user.driverInfo = { licenses: [] };
      user.driverInfo.licenses.push(licenseData);
      if (!user.roles.includes('driver')) user.roles.push('driver');

    // --- Driver Info Update ---
    } else if (section === 'driverInfo') {
      if (!user.driverInfo) user.driverInfo = { licenses: [] };
      
      // Update driverInfo fields
      if (data.status !== undefined) user.driverInfo.status = data.status;
      if (data.idProof !== undefined) user.driverInfo.idProof = data.idProof;
      
      // Handle licenses array
      if (data.licenses && Array.isArray(data.licenses)) {
        // Validate each license before adding
        const validatedLicenses = data.licenses.map((license: any) => {
          if (!license.licenseType || !license.licenseNumber || !license.vehicleCategory || license.hourlyRate === undefined) {
            throw new Error('License type, number, vehicle category, and hourly rate are required');
          }
          
          return {
            licenseType: license.licenseType,
            licenseNumber: license.licenseNumber,
            licenseImage: license.licenseImage || '',
            vehicleCategory: license.vehicleCategory,
            hourlyRate: license.hourlyRate,
            expiryDate: license.expiryDate ? new Date(license.expiryDate) : undefined,
            isActive: license.isActive !== undefined ? license.isActive : true,
          };
        });
        
        // Replace entire licenses array with validated data
        user.driverInfo.licenses = validatedLicenses;
        
        // Add driver role if licenses exist
        if (!user.roles.includes('driver')) user.roles.push('driver');
      }

    // --- Generic Updates ---
    } else {
      if (section === 'personal') {
        const allowedFields = ['name', 'phone', 'age', 'gender', 'profileImage', 'permanentAddress'];
        for (const field of allowedFields) {
          if (data[field] !== undefined) (user as any)[field] = data[field];
        }
      } else {
        const updateQuery = { $set: { [section]: data } };
        await User.findByIdAndUpdate(userId, updateQuery, { new: true, runValidators: true, session });
      }
    }

    await user.save({ session });
    await session.commitTransaction();

    const updatedUser = await User.findById(userId)
      .populate('driverInfo.linkedVehicleId')
      .populate({ 
        path: 'ownerInfo.vehicles', 
        select: 'selfDriven vehicleType make model status plateNumber perKmRate isAvailable' 
      })
      .select('-password')
      .lean();

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    await session.abortTransaction();
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Profile update error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  } finally {
    session.endSession();
  }
}