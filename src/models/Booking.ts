import { Schema, model, Types, Document } from "mongoose";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IBooking extends Document {
  customerId: Types.ObjectId;
  vendorId: Types.ObjectId;
  serviceId: Types.ObjectId;
  addressSnapshot: object;
  scheduledDate: Date;
  status: BookingStatus;
  totalAmount: number;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    addressSnapshot: { type: Object, required: true },
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
