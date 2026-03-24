import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Vehicle } from '@/models/Vehicle';

const MAPPLS_API_KEY = process.env.MAPPLS_API_KEY;

async function getDistanceMatrix(start: string, destination: string, resource: string = "driving") {
    const coordRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (!coordRegex.test(start) || !coordRegex.test(destination)) {
        throw new Error('Invalid coordinates format for Mappls API. Expected "lat,lng".');
    }

    const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/distance_matrix/json?start=${start}&destination=${destination}&resource=${resource}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mappls API failed with status: ${response.status}. Details: ${errorText}`);
        }
        const data = await response.json();
        
        if (data.results && data.results.elements && data.results.elements.length > 0) {
            return data.results.elements[0];
        } else {
            throw new Error('Invalid response structure from Mappls API.');
        }

    } catch (error) {
        console.error("Mappls distance matrix error:", error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { pickup, dropoff, driverId, vehicleId } = await req.json();

        if (!pickup || !dropoff || !driverId || !vehicleId) {
            return NextResponse.json({ message: 'Missing required fields: pickup, dropoff, driverId, vehicleId' }, { status: 400 });
        }

        const [driver, vehicle] = await Promise.all([
            User.findById(driverId).lean(),
            Vehicle.findById(vehicleId).lean()
        ]);

        if (!driver || !driver.roles.includes('driver')) {
            return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
        }
        if (!vehicle) {
            return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
        }

        const matchingLicense = driver.driverInfo.licenses.find(
            l => l.licenseType === vehicle.requiredLicense && l.isActive
        );

        if (!matchingLicense) {
            return NextResponse.json({ message: 'Driver does not have a valid license for this vehicle' }, { status: 400 });
        }
        
        const passengerPickup = `${pickup.lat},${pickup.lng}`;
        const passengerDropoff = `${dropoff.lat},${dropoff.lng}`;

        // The new logic does not differentiate between instant and advance booking for fare calculation, 
        // as the core calculation is based on the travel from pickup to dropoff.
        const leg = await getDistanceMatrix(passengerPickup, passengerDropoff);
        
        const estimatedDistanceKm = leg.distance / 1000;
        const estimatedDurationHours = leg.duration / 3600;

        const fare = {
            driverHourlyRate: matchingLicense.hourlyRate,
            vehiclePerKmRate: vehicle.perKmRate,
            licenseUsed: matchingLicense.licenseType,
            estimatedDuration: estimatedDurationHours,
            estimatedDistance: estimatedDistanceKm,
            platformFeePerKm: 1, // Rs.1 per km as per trip flow
            platformFee: estimatedDistanceKm * 1, // calculated as distance × rate
        };

        const estimatedFare = (fare.estimatedDuration * fare.driverHourlyRate) + (fare.estimatedDistance * fare.vehiclePerKmRate) + fare.platformFee;

        return NextResponse.json({
            ...fare,
            estimatedFare,
            isComboTrip: vehicle.owner.equals(driver._id),
            vehicle: vehicleId,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error calculating fare:', error);
        return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
