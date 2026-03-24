import mongoose, { Document, Schema } from 'mongoose';
import { IUser, LicenseType, VehicleCategory } from './User';
import { IVehicle } from './Vehicle';

// ─── Interfaces ────────────────────────────────────────────────

export interface ILocation {
  address: string;
  coordinates: { lat: number; lng: number };
}

export interface IFare {
  // Snapshots — booking confirm hote waqt lock
  driverHourlyRate: number;
  vehiclePerKmRate: number;
  licenseUsed:      LicenseType;

  // Estimates — passenger ko dikhaye jaate hain
  estimatedDuration: number;  // hours
  estimatedDistance: number;  // km
  estimatedFare:     number;

  // Actuals — trip end pe calculate hote hain
  finalFare?:      number;
  driverTimeCost?: number;    // actualDuration × driverHourlyRate
  vehicleKmCost?:  number;    // actualDistance × vehiclePerKmRate
  platformFeePerKm: number;  // Rs.1 per km (updated from fixed Rs.2)
  platformFee:     number;    // calculated as platformFeePerKm × actualDistance
  driverPayout?:   number;
  ownerPayout?:    number;
  isComboTrip:     boolean;   // true if driver === vehicle.owner
}

export interface IPayment {
  method: 'WALLET' | 'CASH';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number;
  transactionRef?: mongoose.Types.ObjectId;
}

export interface ITripData {
  startTime?:      Date;
  endTime?:        Date;
  actualDistance?: number;    // km
  actualDuration?: number;    // hours
  route?: {
    lat:       number;
    lng:       number;
    timestamp: Date;
  }[];
}

export interface ICancellation {
  isCancelled:     boolean;
  cancelledBy?:    'PASSENGER' | 'DRIVER' | 'OWNER' | 'PLATFORM';
  reason?:         string;
  cancellationFee?: number;  // Pickup charge (perKmRate × 1 km)
  platformFee?: number;       // Platform fee for cancellation
  timestamp?:      Date;
}

export interface IBooking extends Document {
  passenger:          IUser['_id'];
  driver?:            IUser['_id'];
  owner?:             IUser['_id'];
  vehicle?:           IVehicle['_id'];
  bookingType:        'INSTANT' | 'SCHEDULED';
  status:             'REQUESTED' | 'ACCEPTED' | 'ENROUTE' | 'STARTED' | 'COMPLETED' | 'CANCELLED';
  passengers:         number;
  vehicleType:        'bike' | 'auto' | 'car' | 'bus' | 'truck';
  notes?:             string;
  confirmedRequest?:  mongoose.Types.ObjectId;
  pickup:             ILocation;
  dropoff:            ILocation;
  scheduledDateTime?: Date;
  estimatedDistance?: number;
  estimatedDuration?: number;
  fare:               IFare;
  payment?:           IPayment;
  tripData?:          ITripData;
  cancellation?:      ICancellation;
  
  // Request tracking fields
  requestType?:        'instant' | 'scheduled';
  requestCount?:       number;
  maxRequestsPerDay?:  number;
}

// ─── Sub-schemas ───────────────────────────────────────────────

const locationSchema = new Schema<ILocation>({
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
}, { _id: false });

const fareSchema = new Schema<IFare>({
  driverHourlyRate:  { type: Number, required: true },
  vehiclePerKmRate:  { type: Number, required: true },
  licenseUsed: {
    type: String,
    enum: ['MCWOG','MCG','3W-NT','3W-T','LMV-NT','LMV','HMV','HPMV','HGV'] as LicenseType[],
    required: true,
  },
  estimatedDuration: { type: Number, required: true },
  estimatedDistance: { type: Number, required: true },
  estimatedFare:     { type: Number, required: true },
  finalFare:         Number,
  driverTimeCost:    Number,
  vehicleKmCost:     Number,
  platformFeePerKm:  { type: Number, default: 1 }, // Rs.1 per km
  platformFee:       Number, // calculated at runtime
  driverPayout:      Number,
  ownerPayout:       Number,
  isComboTrip:       { type: Boolean, default: false },
}, { _id: false });

const paymentSchema = new Schema<IPayment>({
  method: { type: String, enum: ['WALLET', 'CASH'], required: true },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    required: true,
  },
  amount:         { type: Number, required: true },
  transactionRef: { type: Schema.Types.ObjectId, ref: 'Transaction' },
}, { _id: false });

const tripDataSchema = new Schema<ITripData>({
  startTime:      Date,
  endTime:        Date,
  actualDistance: Number,
  actualDuration: Number,
  route: [{
    lat:       { type: Number },
    lng:       { type: Number },
    timestamp: { type: Date },
  }],
}, { _id: false });

const cancellationSchema = new Schema<ICancellation>({
  isCancelled:     { type: Boolean, default: false },
  cancelledBy: {
    type: String,
    enum: ['PASSENGER', 'DRIVER', 'OWNER', 'PLATFORM'],
  },
  reason:          String,
  cancellationFee: Number, // Pickup charge
  platformFee:     Number, // Platform fee for cancellation
  timestamp:       Date,
}, { _id: false });

// ─── Main Schema ───────────────────────────────────────────────

const bookingSchema = new Schema<IBooking>({
  passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  driver:    { type: Schema.Types.ObjectId, ref: 'User', index: true },
  owner:     { type: Schema.Types.ObjectId, ref: 'User' },
  vehicle:   { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  bookingType: {
    type: String,
    enum: ['INSTANT', 'SCHEDULED'],
    required: true,
  },
  status: {
    type:    String,
    enum:    ['REQUESTED', 'ACCEPTED', 'ENROUTE', 'STARTED', 'COMPLETED', 'CANCELLED'],
    default: 'REQUESTED',
    index:   true,
  },
  passengers: { type: Number, required: true },
  vehicleType: { type: String, enum: ['bike','auto','car','bus','truck'], required: true },
  notes: { type: String },
  confirmedRequest: { type: Schema.Types.ObjectId, ref: 'BookingRequest' },
  pickup:            { type: locationSchema, required: true },
  dropoff:           { type: locationSchema, required: true },
  scheduledDateTime: Date,
  estimatedDistance: Number,
  estimatedDuration: Number,
  fare:         { type: fareSchema, required: true },
  payment:      paymentSchema,
  tripData:     tripDataSchema,
  cancellation: cancellationSchema,
  
  // Request tracking fields
  requestType: { type: String, enum: ['instant', 'scheduled'] },
  requestCount: { type: Number, default: 0 },
  maxRequestsPerDay: { type: Number, default: 10 },
}, { timestamps: true });

// ─── Indexes ───────────────────────────────────────────────────

bookingSchema.index({ status: 1, driver: 1 });      // driver ka active booking
bookingSchema.index({ status: 1, passenger: 1 });   // passenger ka active booking
bookingSchema.index({ owner: 1, status: 1 });       // owner ka booking history
bookingSchema.index({ scheduledDateTime: 1 });      // scheduled rides fetch
bookingSchema.index({ confirmedRequest: 1 });

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);