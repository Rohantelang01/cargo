
"use client";
import { IUser } from "@/types/driver";

interface PersonalInformationDisplayProps {
  profile: IUser;
}

const PersonalInformationDisplay = ({ profile }: PersonalInformationDisplayProps) => {
  const renderAddress = (address: any, title: string) => {
    if (!address) {
      return <p className="text-gray-500 dark:text-gray-400">{title}: Not provided</p>;
    }
    return (
      <div className="mb-4">
        <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
        <p className="text-gray-900 dark:text-white">{address.addressLine1}</p>
        {address.addressLine2 && <p className="text-gray-900 dark:text-white">{address.addressLine2}</p>}
        <p className="text-gray-900 dark:text-white">{address.village}, {address.tehsil}</p>
        <p className="text-gray-900 dark:text-white">{address.district}, {address.state} - {address.pincode}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Name</p>
          <p className="text-gray-900 dark:text-white">{profile.name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Phone</p>
          <p className="text-gray-900 dark:text-white">{profile.phone}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Age</p>
          <p className="text-gray-900 dark:text-white">{profile.age}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Gender</p>
          <p className="text-gray-900 dark:text-white">{profile.gender}</p>
        </div>
      </div>
      {renderAddress(profile.permanentAddress, "Permanent Address")}
    </div>
  );
};

export default PersonalInformationDisplay;
