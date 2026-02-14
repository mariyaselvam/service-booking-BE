import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { PaginationParams } from "../utils/pagination";
import { GetUsersQuery, GetUserByIdParams } from "../types/query.types";

/**
 * User Controller - Handles HTTP requests for user operations
 */

/**
 * GET /api/users
 * Get all users with pagination, sorting, and search
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - sort: string (default: "createdAt")
 * - order: "asc" | "desc" (default: "desc")
 * - search: string (searches in fullName and email)
 * - role: string (optional filter by role)
 * - status: "ACTIVE" | "BLOCKED" (optional filter by status)
 */
export const getAllUsers = async (req: Request, res: Response) => {
    // Extract pagination params from query string
    const paginationParams: PaginationParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sort: (req.query.sort as string) || "createdAt",
        order: (req.query.order as "asc" | "desc") || "desc",
        search: (req.query.search as string) || "",
    };

    // Build additional filters from query params
    const additionalFilter: any = {};

    if (req.query.role) {
        additionalFilter.role = req.query.role;
    }

    if (req.query.status) {
        additionalFilter.status = req.query.status;
    }

    // Call service layer
    const result = await userService.getAllUsers(paginationParams, additionalFilter);

    res.json(result);
};

/**
 * GET /api/users/:id
 * Get user by ID
 */
export const getUserById = async (req: Request<GetUserByIdParams>, res: Response) => {
    const { id } = req.params;

    const user = await userService.getUserById(id as string);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
};

/**
 * GET /api/users/stats
 * Get user statistics
 */
export const getUserStats = async (req: Request, res: Response) => {
    const stats = await userService.getUserStats();
    res.json({ data: stats });
};
