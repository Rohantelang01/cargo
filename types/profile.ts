
export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IUser {
  name: string;
  age: number;
  gender: string;
  profileImage?: string;
  roles: string[];
  permanentAddress?: IAddress;
  driverInfo?: any; 
  ownerInfo?: any;
  wallet?: any;
}

export type UserProfile = IUser;

export type ProfileResponse = {
  user: UserProfile;
};

export type ProfileUpdateResponse = {
  user: UserProfile;
};

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
};

export type ValidationSchema = Record<string, ValidationRule>;

export const personalInfoValidation: ValidationSchema = {
  name: { required: true, minLength: 2 },
  age: { required: true, min: 18 },
  gender: { required: true },
};

export const addressValidation: ValidationSchema = {
  addressLine1: { required: true, minLength: 3 },
  district: { required: true },
  state: { required: true },
  pincode: { required: true, minLength: 6, maxLength: 6 },
};

export const driverInfoValidation: ValidationSchema = {
  licenseExpiry: { required: false },
};
