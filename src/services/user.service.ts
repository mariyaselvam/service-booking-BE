import { User, IUser } from "../models/User";
import { paginate, PaginationParams, PaginatedResponse } from "../utils/pagination";

/**
 * User Service - Business logic layer for user operations
 */
export class UserService {
    /**
     * Get all users with pagination, sorting, and search
     * @param params - Pagination parameters from query string
     * @param additionalFilter - Optional additional filters (e.g., role, status)
     * @returns Paginated user response
     */
    async getAllUsers(
        params: PaginationParams,
        additionalFilter: Record<string, any> = {}
    ): Promise<PaginatedResponse<IUser>> {
        // Define searchable fields
        const searchFields = ["fullName", "email"];

        // Fields to exclude from response
        const selectFields = "-passwordHash -__v";

        // Use the reusable pagination utility
        const result = await paginate<IUser>(
            User,
            params,
            additionalFilter,
            selectFields
        );

        return result;
    }

    /**
     * Get user by ID
     * @param userId - User ID
     * @returns User document or null
     */
    async getUserById(userId: string): Promise<IUser | null> {
        return User.findById(userId).select("-passwordHash -__v").lean().exec();
    }

    /**
     * Get users by role with pagination
     * @param role - User role to filter by
     * @param params - Pagination parameters
     * @returns Paginated user response
     */
    async getUsersByRole(
        role: string,
        params: PaginationParams
    ): Promise<PaginatedResponse<IUser>> {
        return this.getAllUsers(params, { role });
    }

    /**
     * Get users by status with pagination
     * @param status - User status to filter by
     * @param params - Pagination parameters
     * @returns Paginated user response
     */
    async getUsersByStatus(
        status: "ACTIVE" | "BLOCKED",
        params: PaginationParams
    ): Promise<PaginatedResponse<IUser>> {
        return this.getAllUsers(params, { status });
    }

    /**
     * Get user statistics
     * @returns User statistics
     */
    async getUserStats() {
        const [total, activeUsers, blockedUsers, roleDistribution] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: "ACTIVE" }),
            User.countDocuments({ status: "BLOCKED" }),
            User.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        return {
            total,
            activeUsers,
            blockedUsers,
            roleDistribution: roleDistribution.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}

// Export singleton instance
export const userService = new UserService();
