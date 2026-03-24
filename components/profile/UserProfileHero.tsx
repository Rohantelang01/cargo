
"use client";

import { IUser } from "@/types/driver";
import { AtSign, User, Shield, Briefcase, Car } from "lucide-react";

interface UserProfileHeroProps {
  profile: IUser;
}

const UserProfileHero = ({ profile }: UserProfileHeroProps) => {

  const getUserTag = (user: any) => {
    const isDriver = user.roles.includes('driver');
    const isOwner = user.roles.includes('owner');
    const vehicles = user.ownerInfo?.vehicles || [];
    const licenses = user.driverInfo?.licenses || [];

    if (isDriver && isOwner) {
      // Check actual selfDriven status of each vehicle
      const selfDrivenVehicles = vehicles.filter((v: any) => v.selfDriven === true);
      const rentedVehicles = vehicles.filter((v: any) => v.selfDriven === false);

      if (selfDrivenVehicles.length > 0 && rentedVehicles.length > 0) {
        // Has both: self driven + rented out vehicles
        return {
          tag: 'Self Driver + Owner',
          selfDriverCount: selfDrivenVehicles.length,
          ownerCount: rentedVehicles.length,
          licenseCount: licenses.length,
        };
      } else if (selfDrivenVehicles.length > 0 && rentedVehicles.length === 0) {
        // All vehicles are self driven
        return {
          tag: 'Self Driver',
          vehicleCount: selfDrivenVehicles.length,
          licenseCount: licenses.length,
        };
      } else {
        // Has driver role + owner role but all vehicles are rented out (selfDriven: false)
        // Treat as Driver + Owner separately
        return {
          tag: 'Driver + Owner',
          vehicleCount: rentedVehicles.length,
          licenseCount: licenses.length,
        };
      }
    }

    if (isOwner) {
      return {
        tag: 'Owner',
        vehicleCount: vehicles.length,
      };
    }

    if (isDriver) {
      return {
        tag: 'Driver',
        licenseCount: licenses.length,
      };
    }

    return { tag: 'Passenger' };
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Passenger':
        return 'bg-green-600 text-white';
      case 'Driver':
        return 'bg-blue-600 text-white';
      case 'Owner':
        return 'bg-orange-600 text-white';
      case 'Self Driver':
        return 'bg-purple-600 text-white';
      case 'Self Driver + Owner':
        return 'bg-purple-600 text-white'; // Primary color for mixed role
      case 'Driver + Owner':
        return 'bg-indigo-600 text-white'; // Different color for rented out vehicles case
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'driver':
        return <Car className="w-4 h-4 mr-1.5" />;
      case 'owner':
        return <Briefcase className="w-4 h-4 mr-1.5" />;
      case 'self driver':
      case 'self driver + owner':
      case 'driver + owner':
        return <Car className="w-4 h-4 mr-1.5" />;
      default:
        return <User className="w-4 h-4 mr-1.5" />;
    }
  };

  const userTag = getUserTag(profile);

  const renderTagBadge = (tag: string, count?: number, color?: string) => {
    const badgeColor = color || getTagColor(tag);
    return (
      <span className={`flex items-center ${badgeColor} text-xs font-bold px-3 py-1.5 rounded-full relative`}>
        {getTagIcon(tag)}
        {tag}
        {count && count > 1 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-slate-800 text-white rounded-xl shadow-2xl p-6 md:p-8 mb-8 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(107,114,128,0.1),_transparent_30%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(107,114,128,0.1),_transparent_30%)]"></div>
        
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left z-10 relative">
        <div className="relative mb-4 md:mb-0 md:mr-8">
          <img 
            src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.name.replace(/\s/g, "+")}&background=random&color=fff`}
            alt="Profile Image" 
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-700/50 shadow-lg object-cover"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
          
          <div className="flex items-center justify-center md:justify-start text-lg mt-2 text-slate-300">
            <AtSign className="h-5 w-5 mr-2 text-slate-400" />
            <span>{profile.email}</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start text-md mt-2 text-slate-400">
            <User className="h-5 w-5 mr-2" />
            <span>{profile.gender}, {profile.age} years old</span>
          </div>
          
          {userTag && (
            <div className="mt-5 pt-3 border-t border-slate-700/50 flex flex-wrap justify-center md:justify-start items-center gap-3">
              <h3 className="text-sm font-semibold text-slate-300 mr-2 flex items-center">
                <Shield className="h-5 w-5 mr-1.5 text-slate-400" /> Role:
              </h3>
              
              {userTag.tag === 'Self Driver + Owner' ? (
                <>
                  {renderTagBadge('Self Driver', userTag.selfDriverCount, 'bg-purple-600 text-white')}
                  {renderTagBadge('Owner', userTag.ownerCount, 'bg-orange-600 text-white')}
                </>
              ) : userTag.tag === 'Driver + Owner' ? (
                <>
                  {renderTagBadge('Driver', userTag.licenseCount, 'bg-blue-600 text-white')}
                  {renderTagBadge('Owner', userTag.vehicleCount, 'bg-orange-600 text-white')}
                </>
              ) : (
                renderTagBadge(
                  userTag.tag,
                  userTag.vehicleCount || userTag.licenseCount
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHero;
