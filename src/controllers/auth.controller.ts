import { Request, Response } from "express";
import { User, UserRole } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AppError } from "../middlewares/error.middleware";

export const register = async (req: Request, res: Response) => {
    const { fullName, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        throw new AppError("Email already registered", 400);
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
        fullName,
        email,
        phone,
        passwordHash,
        role: UserRole.CUSTOMER,
    });

    res.status(201).json({
        token: generateToken(user),
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
        },
    });

};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
        throw new AppError("Invalid credentials", 401);
    }

    res.json({
        token: generateToken(user),
        user,
    });
};
