
"use client";
import { Car, Star, DollarSign, FileText, CheckCircle, XCircle } from "lucide-react";
import { ILicense } from "@/types/driver";
import { Badge } from "@/components/ui/badge";

interface DrivingInformationDisplayProps {
  driverInfo?: {
    licenses: ILicense[];
    idProof?: string;
    status?: string;
    rating?: number;
    totalTrips?: number;
  };
}

const DrivingInformationDisplay = ({ driverInfo }: DrivingInformationDisplayProps) => {
  if (!driverInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No driving information available</p>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'ON_TRIP':
        return 'bg-blue-100 text-blue-800';
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Driver Status</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driverInfo.status)}`}>
          {driverInfo.status || 'OFFLINE'}
        </span>
      </div>

      {/* ID Proof */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium">ID Proof</p>
            <p className="text-sm text-gray-500">
              {driverInfo.idProof ? 'Document uploaded' : 'No document uploaded'}
            </p>
          </div>
        </div>
        {driverInfo.idProof ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Licenses Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Licenses</h3>
        <div className="space-y-4">
          {driverInfo.licenses.map((license, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {license.licenseType}
                  </Badge>
                  <span className={`px-2 py-1 rounded text-xs ${
                    license.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {license.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">License Number:</span>
                  <p className="text-gray-900 dark:text-white">{license.licenseNumber}</p>
                </div>
                <div>
                  <span className="font-medium">Vehicle Category:</span>
                  <p className="text-gray-900 dark:text-white">{license.vehicleCategory}</p>
                </div>
                <div>
                  <span className="font-medium">Hourly Rate:</span>
                  <p className="text-gray-900 dark:text-white">₹{license.hourlyRate}/hr</p>
                </div>
                {license.expiryDate && (
                  <div>
                    <span className="font-medium">Expiry Date:</span>
                    <p className="text-gray-900 dark:text-white">{license.expiryDate}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Star className="h-6 w-6 text-yellow-400" />
          <div>
            <p className="font-medium">Rating</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {driverInfo.rating?.toFixed(1) ?? 'Not Rated'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Car className="h-6 w-6 text-blue-500" />
          <div>
            <p className="font-medium">Total Trips</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {driverInfo.totalTrips ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingInformationDisplay;
