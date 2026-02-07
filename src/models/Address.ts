import { Schema, model, Types, Document } from "mongoose";

export interface IAddress extends Document {
  userId: Types.ObjectId;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    line1: { type: String, required: true },
    line2: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address = model<IAddress>("Address", addressSchema);
