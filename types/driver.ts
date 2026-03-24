export type LicenseType =
  | 'MCWOG' | 'MCG' | '3W-NT' | '3W-T'
  | 'LMV-NT' | 'LMV' | 'HMV' | 'HPMV' | 'HGV';

export type VehicleCategory = 'bike' | 'auto' | 'car' | 'bus' | 'truck';

export const LICENSE_VEHICLE_MAP: Record<LicenseType, VehicleCategory> = {
  'MCWOG': 'bike',
  'MCG': 'bike',
  '3W-NT': 'auto',
  '3W-T': 'auto',
  'LMV-NT': 'car',
  'LMV': 'car',
  'HMV': 'truck',
  'HPMV': 'bus',
  'HGV': 'truck',
};

export interface ILicense {
  licenseType: LicenseType;
  licenseNumber: string;
  licenseImage: string;
  vehicleCategory: VehicleCategory;
  hourlyRate: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface IDriverInfo {
  licenses: ILicense[];
  idProof?: string;
  status?: 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP' | 'SCHEDULED' | 'UNAVAILABLE';
  rating?: number;
  totalTrips?: number;
}

export interface IOwnerInfo {
  vehicles: string[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  profileImage?: string;
  permanentAddress?: {
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
  };
  roles: string[];
  driverInfo?: IDriverInfo;
  ownerInfo?: IOwnerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface IVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vehicleType: 'bike' | 'auto' | 'car' | 'bus' | 'truck';
  seatingCapacity: number;
  perKmRate: number;
  rcDocument?: string;
  insurance?: string;
  isAvailable: boolean;
  requiredLicense: string;
  selfDriven: boolean;
  owner: string;
}

export type FindRideMode = "instant" | "prebooking";
export type VehicleTypeFilter = "bike" | "auto" | "car" | "truck" | "all";
export type FindRideSortBy = "nearby" | "rating" | "price";
export type FindRideStatusFilter = "online" | "active" | "offline" | "all";
export type FindRideRoleFilter = "driver" | "owner" | "selfdriven" | "both" | "all";
export type FindRideLocation = null | { label: string; coords: { lat: number; lng: number } };
export type FindRideFilters = {
  roleFilter: FindRideRoleFilter;
  sortBy: FindRideSortBy;
  status: FindRideStatusFilter;
  vehicleType: VehicleTypeFilter;
};
export type FindRideQuery = {
  mode: FindRideMode;
  source: FindRideLocation;
  destination: FindRideLocation;
  passengers: number;
  vehicleType: VehicleTypeFilter;
  purpose: string;
  notes: string;
  prebookDate?: string;
  prebookTime?: string;
};

export type FindRideResultRole = "driver" | "owner";
export type FindRideResult = {
  userId: string;
  name: string;
  roles: string[];
  primaryRole: FindRideResultRole;
  status: "ONLINE" | "ACTIVE" | "OFFLINE";
  rating: number;
  totalTrips: number;
  distanceAwayKm: number;
  arrivalEtaMin: number;
  vehicle: {
    _id: string;
    make: string;
    model: string;
    plateNumber: string;
    vehicleType: IVehicle["vehicleType"];
    seatingCapacity: number;
    perKmRate: number;
    selfDriven: boolean;
  } | null;
  estimatedFare: number | null;
};

// ─── Result Types ─────────────────────────────────────────────────────────────

export interface DriverOnlyResult {
  type: "driver"
  userId: string
  name: string
  profileImage?: string
  roles: string[]
  permanentAddress?: {
    addressLine1?: string
    addressLine2?: string
    village?: string
    tehsil?: string
    district?: string
    state?: string
    pincode?: string
    coordinates?: { lat: number; lng: number }
  }
  driverInfo: {
    licenses: ILicense[]
    status: string
    rating: number
    totalTrips: number
  }
  distanceAway: number       // permanentAddress → pickup (km)
  arrivalMinutes: number
  estimatedFare: number      // driverRate only (no vehicle yet)
}

export interface OwnerOnlyResult {
  type: "owner"
  userId: string
  name: string
  profileImage?: string
  roles: string[]
  permanentAddress?: {
    addressLine1?: string
    addressLine2?: string
    village?: string
    tehsil?: string
    district?: string
    state?: string
    pincode?: string
    coordinates?: { lat: number; lng: number }
  }
  vehicle: {
    _id: string
    make: string
    model: string
    year: number
    plateNumber: string
    vehicleType: string
    seatingCapacity: number
    perKmRate: number
    rcDocument?: string
    insurance?: string
  }
  ownerInfo: {
    rating: number
    totalTrips: number
    status: string
  }
  distanceAway: number
  arrivalMinutes: number
  estimatedFare: number      // ownerRate only (no driver yet)
}

export interface SelfDriverResult {
  type: "selfdriver"
  userId: string
  name: string
  profileImage?: string
  roles: string[]
  isCombo: true
  // Instant → currentLocation, Prebooking → permanentAddress
  currentLocation?: {
    lat: number
    lng: number
    address?: string
  }
  permanentAddress?: {
    addressLine1?: string
    addressLine2?: string
    village?: string
    tehsil?: string
    district?: string
    state?: string
    pincode?: string
    coordinates?: { lat: number; lng: number }
  }
  driverInfo: {
    licenses: ILicense[]
    status: string
    rating: number
    totalTrips: number
  }
  vehicle: {
    _id: string
    make: string
    model: string
    year: number
    plateNumber: string
    vehicleType: string
    seatingCapacity: number
    perKmRate: number
    rcDocument?: string
    insurance?: string
    selfDriven: true
  }
  distanceAway: number
  arrivalMinutes: number
  estimatedFare: number      // driverRate + ownerRate + platformFee + pickupReturn
}

export interface PairResult {
  type: "pair"
  pairId: string             // format: "driverId:ownerId:vehicleId"
  driver: {
    userId: string
    name: string
    profileImage?: string
    permanentAddress?: {
      addressLine1?: string
      addressLine2?: string
      village?: string
      tehsil?: string
      district?: string
      state?: string
      pincode?: string
      coordinates?: { lat: number; lng: number }
    }
    driverInfo: {
      licenses: ILicense[]
      status: string
      rating: number
      totalTrips: number
    }
    distanceAway: number     // driver permanentAddress → pickup
  }
  owner: {
    userId: string
    name: string
    profileImage?: string
    permanentAddress?: {
      addressLine1?: string
      addressLine2?: string
      village?: string
      tehsil?: string
      district?: string
      state?: string
      pincode?: string
      coordinates?: { lat: number; lng: number }
    }
    vehicle: {
      _id: string
      make: string
      model: string
      year: number
      plateNumber: string
      vehicleType: string
      seatingCapacity: number
      perKmRate: number
      rcDocument?: string
      insurance?: string
    }
    ownerInfo: {
      rating: number
      totalTrips: number
      status: string
    }
    distanceAway: number     // owner permanentAddress → pickup
  }
  matchedLicense: ILicense   // driver ki woh license jo vehicle type se match karti hai
  fareBreakdown: {
    driverRate: number       // hourlyRate × tripHours
    ownerRate: number        // perKmRate × tripKm
    platformFee: number      // ₹1 × tripKm
    pickupReturnCharge: number // combinedDistance × ₹1 × 2
    totalFare: number
  }
  legs: {
    driverToOwner: number    // Leg 1 (km)
    ownerToPickup: number    // Leg 2 (km)
    tripKm: number           // Leg 3 (km) — pickup → destination
    destinationToOwner: number // Leg 4 (km)
    ownerToDriver: number    // Leg 5 (km)
    total: number            // all 5 legs combined
  }
  arrivalMinutes: number
  estimatedFare: number      // same as fareBreakdown.totalFare
}

export type AnyResult = DriverOnlyResult | OwnerOnlyResult | SelfDriverResult | PairResult

// ─── TopBar ───────────────────────────────────────────────────────────────────
export interface TopBarState {
  km: number | null;
  minutes: number | null;
  cost: number | null;
  driverRate?: number;
  ownerRate?: number;
  platformFee?: number;
  pickupReturnCharge?: number;
  driverPickupDistance?: number;
  tripHours?: number;
  hourlyRate?: number;
  perKmRate?: number;
  linkedDriverId?: string | null;
}

// ─── FindRideState ────────────────────────────────────────────────────────────
export interface FindRideState {
  mode: 'instant' | 'prebooking';
  pickup: string;
  destination: string;
  pickupCoords: { lat: number; lng: number } | null;
  destCoords: { lat: number; lng: number } | null;
  passengers: number;
  vehicleType: string;
  purpose: string;
  notes: string;
  date: string;
  time: string;
  selectedDriver: AnyResult | null;
  linkedDriverId: string | null;
  filters: {
    type: string;
    sort: string;
    status: string;
    vehicle: string;
  };
  topBar: TopBarState;
  drivers: AnyResult[];
  loading: boolean;
}

export interface PrebookingPair {
  pairId: string;
  driver: AnyResult;
  owner: AnyResult;
  vehicle: {
    make: string; model: string; plateNumber: string;
    vehicleType: string; seatingCapacity: number; perKmRate: number;
  };
  driverRate: number;
  ownerRate: number;
  totalFare: number;
  combinedDistance: number;
}

export type BookingStatus =
  'idle' | 'sending' | 'waiting' | 'confirmed' | 'failed';