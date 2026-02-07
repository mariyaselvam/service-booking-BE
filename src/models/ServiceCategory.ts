import { Schema, model, Document } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
}

const serviceCategorySchema = new Schema<IServiceCategory>({
  name: { type: String, required: true, unique: true },
});

export const ServiceCategory = model<IServiceCategory>(
  "ServiceCategory",
  serviceCategorySchema
);
