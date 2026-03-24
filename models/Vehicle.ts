import mongoose, { Document, Schema } from 'mongoose';

// ─── Types ─────────────────────────────────────────────────────

export type VehicleType    = 'bike' | 'auto' | 'car' | 'bus' | 'truck';
export type LicenseType    = 'MCWOG' | 'MCG' | '3W-NT' | '3W-T' | 'LMV-NT' | 'LMV' | 'HMV' | 'HPMV' | 'HGV';

// KEY FIX: boolean isAvailable → proper 3-state status
// OFFLINE   — owner ne manually disable kiya
// AVAILABLE — koi book kar sakta hai
// ON_TRIP   — abhi active trip pe hai (system-set)
export type VehicleStatus  = 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP';

// ─── Sub-Interfaces ────────────────────────────────────────────

// Vehicle inspection record — future feature
export interface IInspection {
  inspectedAt:   Date;
  inspectedBy?:  string;      // Inspector name or org
  nextDueAt?:    Date;
  notes?:        string;
  passed:        boolean;
}

// Damage/incident report linked to a booking
export interface IDamageReport {
  bookingId:    mongoose.Types.ObjectId;
  reportedBy:   mongoose.Types.ObjectId; // userId (driver or owner)
  reportedAt:   Date;
  description:  string;
  images?:      string[];     // Cloudinary URLs
  resolved:     boolean;
  resolvedAt?:  Date;
  resolvedBy?:  mongoose.Types.ObjectId; // Admin
}

// ─── Main Interface ────────────────────────────────────────────

export interface IVehicle extends Document {
  // Ownership & Assignment
  owner:           mongoose.Types.ObjectId;   // always required
  assignedDriver?: mongoose.Types.ObjectId;   // pure driver OR self-driver
  selfDriven:      boolean;                   // true = owner drives their own vehicle

  // Vehicle Identity
  make:            string;    // manufacturer (e.g. Maruti Suzuki)
  model:           string;    // model name (e.g. Swift) — NOTE: field is 'model', NOT 'vehicleModel'
  year:            number;
  color:           string;
  plateNumber:     string;    // unique

  // Classification
  vehicleType:     VehicleType;
  requiredLicense: LicenseType;  // which license type can drive this

  // Capacity & Pricing
  seatingCapacity: number;
  perKmRate:       number;       // base rate — fare calculation uses this

  // Documents (Cloudinary URLs)
  rcDocument?:     string;
  insurance?:      string;
  vehicleImages?:  string[];     // multiple photos

  // KEY FIX: Status (replaces old boolean isAvailable)
  // OFFLINE   — not accepting any bookings
  // AVAILABLE — ready to be booked
  // ON_TRIP   — currently in an active trip (system-set)
  //
  // Owner Status Rules:
  //   Owner OFFLINE → all vehicles overridden to OFFLINE
  //   Owner ONLINE  → each vehicle manages its own status independently
  //
  // Self Driver Rules:
  //   User.status syncs with Vehicle.status:
  //     ONLINE  → Vehicle: AVAILABLE
  //     ON_TRIP → Vehicle: ON_TRIP
  //     OFFLINE → Vehicle: OFFLINE
  status: VehicleStatus;

  // Location
  currentLocation?: {
    type:        'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Maintenance
  maintenanceMode:      boolean;    // true = not bookable (under repair)
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;       // future: scheduled maintenance alerts
  odometer?:            number;     // km reading — future: track usage

  // Future: Inspection & Damage
  inspections?:    IInspection[];
  damageReports?:  IDamageReport[];

  // Future: Features list (AC, GPS tracker, child seat etc.)
  features?: string[];

  // Future: Rating (vehicles can be rated separately from driver)
  rating?:     number;
  totalTrips?: number;
}

// ─── Sub-Schemas ───────────────────────────────────────────────

const inspectionSchema = new Schema<IInspection>({
  inspectedAt:  { type: Date, required: true },
  inspectedBy:  String,
  nextDueAt:    Date,
  notes:        String,
  passed:       { type: Boolean, required: true },
}, { _id: false });

const damageReportSchema = new Schema<IDamageReport>({
  bookingId:   { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  reportedBy:  { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  reportedAt:  { type: Date, default: Date.now },
  description: { type: String, required: true },
  images:      [String],
  resolved:    { type: Boolean, default: false },
  resolvedAt:  Date,
  resolvedBy:  { type: Schema.Types.ObjectId, ref: 'User' },
}, { _id: true }); // _id: true — resolve specific reports

// ─── Main Schema ───────────────────────────────────────────────

const vehicleSchema = new Schema<IVehicle>({
  // Ownership & Assignment
  owner:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'User' },
  selfDriven:     { type: Boolean, default: false },

  // Vehicle Identity
  make:        { type: String, required: true, trim: true },
  model:       { type: String, required: true, trim: true },  // ← 'model', NOT 'vehicleModel'
  year:        { type: Number, required: true },
  color:       { type: String, required: true },
  plateNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },

  // Classification
  vehicleType: {
    type:     String,
    enum:     ['bike', 'auto', 'car', 'bus', 'truck'],
    required: true,
  },
  requiredLicense: {
    type:     String,
    enum:     ['MCWOG','MCG','3W-NT','3W-T','LMV-NT','LMV','HMV','HPMV','HGV'],
    required: true,
  },

  // Capacity & Pricing
  seatingCapacity: { type: Number, required: true, min: 1 },
  perKmRate:       { type: Number, required: true, min: 0 },

  // Documents
  rcDocument:    String,
  insurance:     String,
  vehicleImages: [String],

  // KEY FIX: Status field (replaces old isAvailable: boolean)
  status: {
    type:    String,
    enum:    ['OFFLINE', 'AVAILABLE', 'ON_TRIP'],
    default: 'OFFLINE',
  },

  // Location
  currentLocation: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [] },
  },

  // Maintenance
  maintenanceMode:      { type: Boolean, default: false },
  lastMaintenanceDate:  Date,
  nextMaintenanceDate:  Date,
  odometer:             { type: Number, default: 0, min: 0 },

  // Future: Inspection & Damage tracking
  inspections:   [inspectionSchema],
  damageReports: [damageReportSchema],

  // Future: Features
  features: [String],

  // Future: Vehicle-level rating
  rating:     { type: Number, default: 0, min: 0, max: 5 },
  totalTrips: { type: Number, default: 0, min: 0 },

}, { timestamps: true });

// ─── Indexes ───────────────────────────────────────────────────

vehicleSchema.index({ currentLocation: '2dsphere' });
vehicleSchema.index({ vehicleType: 1, status: 1 });            // type + availability filter
vehicleSchema.index({ owner: 1 });                             // owner's vehicles list
vehicleSchema.index({ assignedDriver: 1 });                    // driver's assigned vehicle
vehicleSchema.index({ requiredLicense: 1, status: 1 });        // license-based matching
vehicleSchema.index({ selfDriven: 1, status: 1 });             // self-driver instant booking queries
vehicleSchema.index({ maintenanceMode: 1, status: 1 });        // maintenance filter

// ─── Model Export ──────────────────────────────────────────────

export const Vehicle =
  mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);