import mongoose, { Document, Schema } from 'mongoose';
import { IBooking } from './Booking';

export interface ILiveTracking {
  isActive: boolean;
  currentLocation?: {
    lat:       number;
    lng:       number;
    timestamp: Date;
  };
  route?: {
    lat:       number;
    lng:       number;
    timestamp: Date;
    speed:     number;
  }[];
}

export interface IApprovals {
  passengerApproval?: boolean;
  ownerApproval?:     boolean;
}

export interface ITrip extends Document {
  bookingId:         IBooking['_id'];
  liveTracking?:     ILiveTracking;
  approvals?:        IApprovals;
  completionMethod?: 'auto' | 'manual' | 'passenger_confirmed';
}

// ─── Sub-schemas ───────────────────────────────────────────────

const liveTrackingSchema = new Schema<ILiveTracking>({
  isActive: { type: Boolean, default: false },
  currentLocation: {
    lat:       Number,
    lng:       Number,
    timestamp: Date,
  },
  route: [{
    lat:       { type: Number },
    lng:       { type: Number },
    timestamp: { type: Date },
    speed:     { type: Number, default: 0 },
  }],
}, { _id: false });

const approvalsSchema = new Schema<IApprovals>({
  passengerApproval: { type: Boolean, default: false },
  ownerApproval:     { type: Boolean, default: false },
}, { _id: false });

// ─── Main Schema ───────────────────────────────────────────────

const tripSchema = new Schema<ITrip>({
  bookingId: {
    type:     Schema.Types.ObjectId,
    ref:      'Booking',
    required: true,
    unique:   true,   // ek booking ka sirf ek trip hoga
    index:    true,
  },
  liveTracking:     liveTrackingSchema,
  approvals:        approvalsSchema,
  completionMethod: {
    type: String,
    enum: ['auto', 'manual', 'passenger_confirmed'],
  },
}, { timestamps: true });

export const Trip =
  mongoose.models.Trip || mongoose.model<ITrip>('Trip', tripSchema);