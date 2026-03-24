import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── License Types ─────────────────────────────────────────────

export type LicenseType =
  | 'MCWOG'   // Motorcycle Without Gear (scooty, moped)
  | 'MCG'     // Motorcycle With Gear (bike)
  | '3W-NT'   // Three Wheeler Non-Transport (personal auto)
  | '3W-T'    // Three Wheeler Transport (commercial auto)
  | 'LMV-NT'  // Light Motor Vehicle Non-Transport (personal car)
  | 'LMV'     // Light Motor Vehicle Transport (taxi/cab)
  | 'HMV'     // Heavy Motor Vehicle (generic)
  | 'HPMV'    // Heavy Passenger Motor Vehicle (bus)
  | 'HGV';    // Heavy Goods Vehicle (truck)

export type VehicleCategory = 'bike' | 'auto' | 'car' | 'bus' | 'truck';

export type UserRole = 'passenger' | 'driver' | 'owner' | 'admin';

export type UserStatus = 'OFFLINE' | 'ONLINE' | 'ON_TRIP';

export type DriverStatus =
  | 'OFFLINE'      // Not visible to anyone
  | 'AVAILABLE'    // Ready to accept bookings
  | 'ON_TRIP'      // Currently on a trip (system-set)
  | 'SCHEDULED'    // Has a confirmed upcoming prebooking
  | 'UNAVAILABLE'; // Online but not accepting bookings

// License ↔ Vehicle category mapping (enforced at query level)
export const LICENSE_VEHICLE_MAP: Record<LicenseType, VehicleCategory> = {
  'MCWOG':  'bike',
  'MCG':    'bike',
  '3W-NT':  'auto',
  '3W-T':   'auto',
  'LMV-NT': 'car',
  'LMV':    'car',
  'HMV':    'truck',
  'HPMV':   'bus',
  'HGV':    'truck',
};

// ─── Sub-Interfaces ────────────────────────────────────────────

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  pincode: string;
  coordinates?: { lat: number; lng: number };
}

export interface ICurrentLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude] — GeoJSON order
}

export interface IVerification {
  isAadhaarVerified: boolean;
  isPanVerified: boolean;
  aadhaarNumber?: string;
  panNumber?: string;
  // Future: selfie verification, address proof
  isSelfieVerified?: boolean;
  selfieImage?: string;
  verifiedAt?: Date;
}

// Single license entry — driver ke paas multiple ho sakte hain
// Har license ka type unique hona chahiye (same type dobara nahi)
export interface ILicense {
  licenseType: LicenseType;         // MCG, LMV, HGV etc.
  licenseNumber: string;            // actual license number
  licenseImage: string;             // Cloudinary URL
  vehicleCategory: VehicleCategory; // bike, car, truck etc.
  hourlyRate: number;               // driver ka rate is license ke liye
  expiryDate?: Date;
  isActive: boolean;                // false = permanently disabled (e.g. license expire)
  // Future: verification status per license
  isVerified?: boolean;
  verifiedAt?: Date;
}

export interface IDriverInfo {
  licenses: ILicense[];             // array — har type unique hona chahiye
  idProof?: string;                 // Cloudinary URL
  status: DriverStatus;             // driver-specific availability status
  rating: number;                   // average rating (0-5)
  totalTrips: number;               // completed trips count
  linkedVehicleId?: mongoose.Types.ObjectId; // self-drive ke liye — apni vehicle
  // Future: background check, emergency contact
  backgroundCheckStatus?: 'PENDING' | 'CLEARED' | 'FAILED';
  emergencyContact?: { name: string; phone: string; relation: string };
}

export interface IOwnerInfo {
  vehicles: mongoose.Types.ObjectId[]; // listed vehicles
  // Future: owner-level rating, total earnings summary
  rating?: number;
  totalTrips?: number;
}

// Public-facing profile info (for display in app)
export interface IPublicInfo {
  rating: number;
  totalTrips: number;
  memberSince: Date;
  bio?: string;            // short intro
  languages?: string[];    // spoken languages — future UX feature
}

// Penalty tracking for driver violations
export interface IPenalty {
  type: 'WARNING' | 'RED_CARD';
  reason: string;
  timestamp: Date;
  bookingId?: mongoose.Types.ObjectId;
  issuedBy?: mongoose.Types.ObjectId; // Admin who issued penalty
}

// ─── Main Interface ────────────────────────────────────────────

export interface IUser extends Document {
  // Core fields
  name: string;
  email: string;
  phone: string;
  password?: string;
  profileImage?: string;
  age: number;
  gender: 'male' | 'female' | 'other';

  // Address & Location
  permanentAddress?: IAddress;
  currentLocation?: ICurrentLocation;

  // Role & Status
  roles: UserRole[];

  // TOP-LEVEL STATUS — applies to all roles
  // OFFLINE: not visible/reachable
  // ONLINE:  active and reachable
  // ON_TRIP: currently on an active trip (system-set)
  // Owner never goes ON_TRIP (vehicles do, not the owner)
  status: UserStatus;

  // Role-specific info
  verification?: IVerification;
  driverInfo?: IDriverInfo;
  ownerInfo?: IOwnerInfo;
  publicInfo?: IPublicInfo;

  // Wallet reference
  wallet?: mongoose.Types.ObjectId;

  // Account state
  isActive: boolean;
  isBanned: boolean;              // permanent ban
  suspensionUntil?: Date;         // temporary suspension end date

  // Penalty system
  redCards: number;               // 5 red cards = permanent ban
  warnings: number;               // 5 warnings = account review
  penaltyHistory?: IPenalty[];

  // Request rate limiting
  requestCount: number;
  lastRequestDate?: Date;
  maxRequestsPerDay: number;

  // Future: FCM / push notification token
  fcmToken?: string;
  notificationsEnabled?: boolean;

  // Future: referral system
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;

  // Method
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Sub-Schemas ───────────────────────────────────────────────

const addressSchema = new Schema<IAddress>({
  addressLine1: { type: String, required: true },
  addressLine2: String,
  village:      String,
  tehsil:       String,
  district:     { type: String, required: true },
  state:        { type: String, required: true },
  pincode:      { type: String, required: true },
  coordinates:  { lat: Number, lng: Number },
}, { _id: false });

const currentLocationSchema = new Schema<ICurrentLocation>({
  type:        { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: [] },
}, { _id: false });

const verificationSchema = new Schema<IVerification>({
  isAadhaarVerified: { type: Boolean, default: false },
  isPanVerified:     { type: Boolean, default: false },
  aadhaarNumber:     String,
  panNumber:         String,
  isSelfieVerified:  { type: Boolean, default: false },
  selfieImage:       String,
  verifiedAt:        Date,
}, { _id: false });

const licenseSchema = new Schema<ILicense>({
  licenseType: {
    type:     String,
    enum:     ['MCWOG','MCG','3W-NT','3W-T','LMV-NT','LMV','HMV','HPMV','HGV'],
    required: true,
  },
  licenseNumber:   { type: String, required: true },
  licenseImage:    { type: String, required: true },
  vehicleCategory: {
    type:     String,
    enum:     ['bike', 'auto', 'car', 'bus', 'truck'],
    required: true,
  },
  hourlyRate:  { type: Number, required: true, min: 0 },
  expiryDate:  Date,
  isActive:    { type: Boolean, default: true },
  isVerified:  { type: Boolean, default: false },
  verifiedAt:  Date,
}, { _id: true }); // _id: true — individual license update ke liye

const driverInfoSchema = new Schema<IDriverInfo>({
  licenses:     { type: [licenseSchema], default: [] },
  idProof:      String,
  status: {
    type:    String,
    enum:    ['OFFLINE', 'AVAILABLE', 'ON_TRIP', 'SCHEDULED', 'UNAVAILABLE'],
    default: 'OFFLINE',
  },
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  totalTrips:      { type: Number, default: 0, min: 0 },
  linkedVehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  backgroundCheckStatus: {
    type: String,
    enum: ['PENDING', 'CLEARED', 'FAILED'],
  },
  emergencyContact: {
    name:     String,
    phone:    String,
    relation: String,
  },
}, { _id: false });

const ownerInfoSchema = new Schema<IOwnerInfo>({
  vehicles:   [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
  rating:     { type: Number, default: 0, min: 0, max: 5 },
  totalTrips: { type: Number, default: 0, min: 0 },
}, { _id: false });

const publicInfoSchema = new Schema<IPublicInfo>({
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  totalTrips:  { type: Number, default: 0, min: 0 },
  memberSince: { type: Date, default: Date.now },
  bio:         String,
  languages:   [String],
}, { _id: false });

const penaltySchema = new Schema<IPenalty>({
  type: {
    type:     String,
    enum:     ['WARNING', 'RED_CARD'],
    required: true,
  },
  reason:    { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  issuedBy:  { type: Schema.Types.ObjectId, ref: 'User' },
}, { _id: false });

// ─── Main Schema ───────────────────────────────────────────────

const userSchema = new Schema<IUser>({
  // Core
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, required: true, unique: true, trim: true },
  password:     { type: String, required: true, select: false },
  profileImage: String,
  age:          { type: Number, required: true, min: 18 },
  gender:       { type: String, enum: ['male', 'female', 'other'], required: true },

  // Address & Location
  permanentAddress: addressSchema,
  currentLocation:  currentLocationSchema,

  // Role & Status
  roles: {
    type:     [String],
    enum:     ['passenger', 'driver', 'owner', 'admin'],
    default:  ['passenger'],
    required: true,
  },

  // TOP-LEVEL STATUS
  // Rules:
  //   Driver:      OFFLINE → ONLINE → ON_TRIP (system-set on trip start/end)
  //   Owner:       OFFLINE | ONLINE only (never ON_TRIP — vehicles go ON_TRIP, not owner)
  //   Self Driver: same as Driver
  //   Passenger:   OFFLINE | ONLINE (no ON_TRIP needed — they ARE the trip rider)
  status: {
    type:    String,
    enum:    ['OFFLINE', 'ONLINE', 'ON_TRIP'],
    default: 'OFFLINE',
  },

  // Role-specific
  verification: verificationSchema,
  driverInfo:   driverInfoSchema,
  ownerInfo:    ownerInfoSchema,
  publicInfo:   publicInfoSchema,

  // Wallet
  wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' },

  // Account state
  isActive:        { type: Boolean, default: true },
  isBanned:        { type: Boolean, default: false },
  suspensionUntil: Date,

  // Penalty system
  redCards:       { type: Number, default: 0, min: 0 },
  warnings:       { type: Number, default: 0, min: 0 },
  penaltyHistory: [penaltySchema],

  // Rate limiting
  requestCount:      { type: Number, default: 0, min: 0 },
  lastRequestDate:   Date,
  maxRequestsPerDay: { type: Number, default: 10 },

  // Future fields (already schema-ready)
  fcmToken:             String,
  notificationsEnabled: { type: Boolean, default: true },
  referralCode:         { type: String, unique: true, sparse: true },
  referredBy:           { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

// ─── Indexes ───────────────────────────────────────────────────

userSchema.index({ currentLocation: '2dsphere' });
userSchema.index({ roles: 1, status: 1 });                  // role + status filter (most common query)
userSchema.index({ 'driverInfo.status': 1 });               // driver availability queries
userSchema.index({ isBanned: 1, isActive: 1 });             // account state filter
userSchema.index({ referralCode: 1 }, { sparse: true });    // referral lookup

// ─── Middleware ────────────────────────────────────────────────

// Password hashing — ALWAYS use new User() + .save(), never insertMany()
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt    = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Password hashing failed'));
  }
});

// ─── Methods ───────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Model Export ──────────────────────────────────────────────

export const User =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);