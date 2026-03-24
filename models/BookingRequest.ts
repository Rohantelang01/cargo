import mongoose, { Document, Schema } from 'mongoose';

export interface IBookingRequest extends Document {
  booking: mongoose.Types.ObjectId;
  passenger: mongoose.Types.ObjectId;

  pair: {
    driver: mongoose.Types.ObjectId;
    owner?: mongoose.Types.ObjectId;
    vehicle: mongoose.Types.ObjectId;
    isCombo: boolean;
  };

  driverResponse: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  ownerResponse: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NA';

  status:
    | 'PENDING'
    | 'BOTH_ACCEPTED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'EXPIRED'
    | 'RELEASED'
    | 'CANCELLED';

  estimatedFare: number;
  distanceKm: number;

  requestedAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
  confirmedAt?: Date;
  
  // Request management fields
  requestType?: 'instant' | 'scheduled';
  dailyRequestCount?: number;
  expiryReason?: string;
  
  // Penalty support fields
  penaltyApplied?: boolean;
  penaltyDetails?: {
    type: 'WARNING' | 'RED_CARD';
    reason: string;
    appliedAt: Date;
    appliedBy: mongoose.Types.ObjectId;
  };
}

const bookingRequestSchema = new Schema<IBookingRequest>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    pair: {
      driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      owner: { type: Schema.Types.ObjectId, ref: 'User' },
      vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
      isCombo: { type: Boolean, required: true },
    },

    driverResponse: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
    ownerResponse: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'NA'],
      default: 'PENDING',
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'BOTH_ACCEPTED', 'CONFIRMED', 'REJECTED', 'EXPIRED', 'RELEASED', 'CANCELLED'],
      default: 'PENDING',
      required: true,
      index: true,
    },

    estimatedFare: { type: Number, required: true },
    distanceKm: { type: Number, required: true },

    requestedAt: { type: Date, default: Date.now, required: true },
    expiresAt: { type: Date, required: true, index: true },
    respondedAt: { type: Date },
    confirmedAt: { type: Date },
    
    // Request management fields
    requestType: { type: String, enum: ['instant', 'scheduled'] },
    dailyRequestCount: { type: Number, default: 0 },
    expiryReason: { type: String },
    
    // Penalty support fields
    penaltyApplied: { type: Boolean, default: false },
    penaltyDetails: {
      type: {
        type: String,
        enum: ['WARNING', 'RED_CARD'],
      },
      reason: { type: String },
      appliedAt: { type: Date },
      appliedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  },
  { timestamps: true }
);

bookingRequestSchema.index({ booking: 1 });
bookingRequestSchema.index({ status: 1, booking: 1 });
bookingRequestSchema.index({ 'pair.driver': 1, status: 1 });
bookingRequestSchema.index({ 'pair.owner': 1, status: 1 });

export const BookingRequest =
  mongoose.models.BookingRequest ||
  mongoose.model<IBookingRequest>('BookingRequest', bookingRequestSchema);
