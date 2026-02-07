import { Schema, model, Document } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
    VENDOR = "VENDOR",
}

export enum UserTier {
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
}

export interface IUser extends Document {
    role: UserRole;
    fullName: string;
    email: string;
    phone?: string;
    passwordHash: string;
    tier: UserTier;
    walletBalance: number;
    lifetimeSpend: number;
    status: "ACTIVE" | "BLOCKED";
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: String,
        passwordHash: { type: String, required: true },
        tier: {
            type: String,
            enum: Object.values(UserTier),
            default: UserTier.SILVER,
        },
        walletBalance: { type: Number, default: 0 },
        lifetimeSpend: { type: Number, default: 0 },
        status: { type: String, default: "ACTIVE" },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
