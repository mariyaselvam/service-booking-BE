import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
