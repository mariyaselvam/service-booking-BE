import { Schema, model, Types, Document } from "mongoose";

export interface IService extends Document {
  categoryId: Types.ObjectId;
  name: string;
  description?: string;
  basePrice: number;
}

const serviceSchema = new Schema<IService>({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "ServiceCategory",
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
});

export const Service = model<IService>("Service", serviceSchema);
