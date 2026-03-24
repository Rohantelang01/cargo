
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Vehicle } from '@/models/Vehicle'; 

const MAPPLS_API_KEY = process.env.MAPPLS_API_KEY;

async function getDistanceMatrix(start: string, destination: string, resource: string = "driving") {
    // Validate coordinates format
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

        const { bookingType, pickup, dropoff, driverId } = await req.json();

        if (!bookingType || !pickup || !dropoff || !driverId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const driver = await User.findById(driverId).populate({
            path: 'driverInfo.vehicle',
            model: Vehicle
        });

        if (!driver || !driver.roles.includes('driver') || !driver.driverInfo || !driver.driverInfo.vehicle) {
            return NextResponse.json({ message: 'Driver or associated vehicle not found' }, { status: 404 });
        }

        const vehicle = driver.driverInfo.vehicle as any; // Cast to access vehicle properties

        let totalDistance = 0;
        let totalDuration = 0;
        let routeDescription = [];

        const passengerPickup = `${pickup.coordinates.lat},${pickup.coordinates.lng}`;
        const passengerDropoff = `${dropoff.coordinates.lat},${dropoff.coordinates.lng}`;

        if (bookingType === 'instant') {
             if (!driver.currentLocation || !driver.currentLocation.coordinates) {
                return NextResponse.json({ message: "Driver's live location is not available." }, { status: 400 });
            }
            const driverLiveLocation = `${driver.currentLocation.coordinates.coordinates[1]},${driver.currentLocation.coordinates.coordinates[0]}`; // lat,lng

            const leg1 = await getDistanceMatrix(driverLiveLocation, passengerPickup);
            totalDistance += leg1.distance;
            totalDuration += leg1.duration;
            routeDescription.push("Driver to Pickup");

            const leg2 = await getDistanceMatrix(passengerPickup, passengerDropoff);
            totalDistance += leg2.distance;
            totalDuration += leg2.duration;
            routeDescription.push("Pickup to Dropoff");

        } else if (bookingType === 'advance') {
            if (!driver.permanentAddress || !driver.permanentAddress.coordinates) {
                return NextResponse.json({ message: "Driver's permanent address is not set." }, { status: 400 });
            }
            const driverHome = `${driver.permanentAddress.coordinates.lat},${driver.permanentAddress.coordinates.lng}`;
            let currentLocation = driverHome;
            routeDescription.push("Driver's Home");

            if (driver.driverInfo.vehicleType === 'rented') {
                const owner = await User.findById(vehicle.owner);
                if (!owner || !owner.permanentAddress || !owner.permanentAddress.coordinates) {
                     return NextResponse.json({ message: 'Vehicle owner or their address not found' }, { status: 404 });
                }
                const ownerGarage = `${owner.permanentAddress.coordinates.lat},${owner.permanentAddress.coordinates.lng}`;

                const leg1 = await getDistanceMatrix(currentLocation, ownerGarage);
                totalDistance += leg1.distance;
                totalDuration += leg1.duration;
                currentLocation = ownerGarage;
                routeDescription.push("Owner's Garage");
            }
            
            const leg2 = await getDistanceMatrix(currentLocation, passengerPickup);
            totalDistance += leg2.distance;
            totalDuration += leg2.duration;
            routeDescription.push("Passenger's Pickup");

            const leg3 = await getDistanceMatrix(passengerPickup, passengerDropoff);
            totalDistance += leg3.distance;
            totalDuration += leg3.duration;
            routeDescription.push("Passenger's Dropoff");

        } else {
            return NextResponse.json({ message: 'Invalid booking type' }, { status: 400 });
        }

        const perKmRate = vehicle.perKmRate;
        const totalFare = (totalDistance / 1000) * perKmRate;

        return NextResponse.json({
            estimatedDistance: totalDistance,
            estimatedDuration: totalDuration,
            totalFare: totalFare.toFixed(2),
            route: routeDescription.join(" -> "),
            vehicleId: vehicle._id
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error calculating fare:', error);
        return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
