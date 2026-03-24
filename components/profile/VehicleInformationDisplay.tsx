
"use client";
import { Car, DollarSign, Palette, Calendar, Users, FileText, CheckCircle, XCircle } from "lucide-react";
import { IVehicle } from "@/types/driver";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface VehicleInformationDisplayProps {
  ownerId: string;
}

const VehicleInformationDisplay = ({ ownerId }: VehicleInformationDisplayProps) => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`/api/vehicles?owner=${ownerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setVehicles(data.vehicles || []);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch vehicles:', errorData);
          console.error('Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [ownerId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Loading vehicles...</p>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No vehicle information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle._id} className="p-6 border rounded-lg">
          {/* Vehicle Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h3>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={vehicle.isAvailable ? "default" : "destructive"}
                className="text-xs"
              >
                {vehicle.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
              {vehicle.selfDriven && (
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                  <span className="flex items-center">
                    <Car className="w-3 h-3 mr-1" />
                    Reserved - Personal Use Only
                  </span>
                </Badge>
              )}
            </div>
          </div>

          {/* Vehicle Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Plate Number</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.plateNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Color</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.color}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Year</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.year}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Specs */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                  <p className="text-gray-900 dark:text-white capitalize">{vehicle.vehicleType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Seating Capacity</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.seatingCapacity} seats</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Rate per KM</p>
                  <p className="text-gray-900 dark:text-white">₹{vehicle.perKmRate}/km</p>
                </div>
              </div>
            </div>

            {/* Requirements & Documents */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Required License</p>
                  <p className="text-gray-900 dark:text-white">{vehicle.requiredLicense}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">RC Document</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-gray-900 dark:text-white">
                      {vehicle.rcDocument ? 'Uploaded' : 'Not uploaded'}
                    </p>
                    {vehicle.rcDocument ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Insurance</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-gray-900 dark:text-white">
                      {vehicle.insurance ? 'Uploaded' : 'Not uploaded'}
                    </p>
                    {vehicle.insurance ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Self Driver Reservation Notice */}
          {vehicle.selfDriven && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Car className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-purple-900">Self Driver Vehicle Reservation</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    This vehicle is permanently reserved for your personal use only. It cannot be assigned to other drivers or rented out through the platform.
                  </p>
                  <div className="mt-2 text-xs text-purple-600">
                    <strong>Rule:</strong> assignedDriver field is locked to owner._id when selfDriven: true
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VehicleInformationDisplay;
