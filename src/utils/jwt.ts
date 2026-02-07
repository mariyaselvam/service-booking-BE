import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { env } from "../config/env";

const JWT_SECRET = env.jwtSecret;

export const generateToken = (user: IUser) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};
