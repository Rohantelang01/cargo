import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User"; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const longitude = parseFloat(searchParams.get("longitude") || "0");
  const latitude = parseFloat(searchParams.get("latitude") || "0");
  const vehicleCategory = searchParams.get("vehicleCategory"); 
  const maxDistance = parseInt(searchParams.get("maxDistance") || "10000", 10); 

  if (!longitude || !latitude || !vehicleCategory) {
    return NextResponse.json(
      { error: "Missing required query parameters: longitude, latitude, vehicleCategory" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const nearbyVehicles = await Vehicle.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
      vehicleType: vehicleCategory,
      isAvailable: true,
    }).populate([
        { path: 'owner', model: 'User' },
        { path: 'assignedDriver', model: 'User' }
    ]);

    const availableDrivers = nearbyVehicles.reduce((acc, vehicle) => {
        const driver = vehicle.selfDriven ? vehicle.owner : vehicle.assignedDriver;

        if (driver && driver.driverInfo && Array.isArray(driver.driverInfo.licenses)) {
            const hasMatchingLicense = driver.driverInfo.licenses.some(
              (license) =>
                license.licenseType === vehicle.requiredLicense && license.isActive
            );

            if (hasMatchingLicense) {
                if (!acc.some(d => d.driver._id.equals(driver._id))) {
                    acc.push({
                        driver,
                        vehicle,
                    });
                }
            }
        }
        return acc;
    }, []);

    return NextResponse.json(availableDrivers);

  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Error fetching nearby drivers:", errorMessage);
    return NextResponse.json(
      {
        error: "Failed to fetch nearby drivers",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}