import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IVehicle } from './Vehicle';

export interface IPassenger {
  passengerId: IUser['_id'];
  bookedAt:    Date;
  seatNumber:  number;
}

export interface IPlannedTrip extends Document {
  ownerId:           IUser['_id'];
  vehicleId:         IVehicle['_id'];        // FIXED: String tha, ab ObjectId
  title:             string;
  route: {
    pickup:  { address: string; coordinates: { lat: number; lng: number } };
    dropoff: { address: string; coordinates: { lat: number; lng: number } };
  };
  scheduledDateTime: Date;
  seatsAvailable:    number;
  seatsBooked:       number;
  farePerSeat:       number;
  passengers:        IPassenger[];
  status:            'active' | 'completed' | 'cancelled';
}

// ─── Sub-schemas ───────────────────────────────────────────────

const passengerSchema = new Schema<IPassenger>({
  passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookedAt:    { type: Date, default: Date.now },
  seatNumber:  { type: Number, required: true },
}, { _id: false });

// ─── Main Schema ───────────────────────────────────────────────

const plannedTripSchema = new Schema<IPlannedTrip>({
  ownerId:   { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // FIXED
  title:     { type: String, required: true },
  route: {
    pickup: {
      address:     { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    dropoff: {
      address:     { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
  },
  scheduledDateTime: { type: Date, required: true },
  seatsAvailable:    { type: Number, required: true },
  seatsBooked:       { type: Number, default: 0, min: 0 },  // min: 0 add kiya
  farePerSeat:       { type: Number, required: true },
  passengers:        [passengerSchema],
  status: {
    type:    String,
    enum:    ['active', 'completed', 'cancelled'],
    default: 'active',
  },
}, { timestamps: true });

// ─── Indexes ───────────────────────────────────────────────────

plannedTripSchema.index({ status: 1, scheduledDateTime: 1 }); // active trips browse
plannedTripSchema.index({ ownerId: 1 });                       // owner ka trip list

export const PlannedTrip =
  mongoose.models.PlannedTrip || mongoose.model<IPlannedTrip>('PlannedTrip', plannedTripSchema);