import { Schema, model, Types, Document } from "mongoose";

export interface IVendorService extends Document {
  vendorId: Types.ObjectId;
  serviceId: Types.ObjectId;
  price: number;
  isActive: boolean;
}

const vendorServiceSchema = new Schema<IVendorService>({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

vendorServiceSchema.index({ vendorId: 1, serviceId: 1 }, { unique: true });

export const VendorService = model<IVendorService>(
  "VendorService",
  vendorServiceSchema
);
