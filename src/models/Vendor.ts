import { Schema, model, Types, Document } from "mongoose";

export enum KycStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

interface WorkingHour {
  day: string;
  start: string;
  end: string;
}

interface ServiceLocation {
  city: string;
  state: string;
  pincode: string;
}

export interface IVendor extends Document {
  userId: Types.ObjectId;
  kycStatus: KycStatus;
  jobsDone: number;
  workingHours: WorkingHour[];
  serviceLocations: ServiceLocation[];
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    kycStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.PENDING,
    },
    jobsDone: { type: Number, default: 0 },
    workingHours: [
      {
        day: String,
        start: String,
        end: String,
      },
    ],
    serviceLocations: [
      {
        city: String,
        state: String,
        pincode: String,
      },
    ],
  },
  { timestamps: true }
);

export const Vendor = model<IVendor>("Vendor", vendorSchema);
