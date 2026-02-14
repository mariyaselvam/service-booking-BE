import { Router } from "express";
import { getAllUsers, getUserById, getUserStats } from "../controllers/user.controller";

const router = Router();

/**
 * GET /api/users/stats - Get user statistics
 * Note: This route must come before /:id to avoid conflicts
 */
router.get("/stats", getUserStats);

/**
 * GET /api/users - Get all users with pagination
 * Query params: page, limit, sort, order, search, role, status
 */
router.get("/", getAllUsers);

/**
 * GET /api/users/:id - Get user by ID
 */
router.get("/:id", getUserById);

export default router;
