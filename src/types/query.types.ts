/**
 * Type definitions for API query parameters
 * Use these for better type safety in controllers
 */

import { Request } from "express";

/**
 * Query parameters for GET /api/users
 */
export interface GetUsersQuery {
    page?: string;
    limit?: string;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    role?: string;
    status?: "ACTIVE" | "BLOCKED";
}

/**
 * Typed request for GET /api/users
 * Usage: const req: TypedRequest<{}, GetUsersQuery>
 */
export type TypedRequest<P = {}, Q = {}> = Request<P, any, any, Q>;

/**
 * Query parameters for GET /api/users/:id
 */
export interface GetUserByIdParams {
    id: string;
}

/**
 * Generic paginated query parameters
 * Can be extended for other resources
 */
export interface PaginatedQuery {
    page?: string;
    limit?: string;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
}

/**
 * Example: Services query parameters
 */
export interface GetServicesQuery extends PaginatedQuery {
    category?: string;
    status?: "ACTIVE" | "INACTIVE";
    vendorId?: string;
    minPrice?: string;
    maxPrice?: string;
}

/**
 * Example: Bookings query parameters
 */
export interface GetBookingsQuery extends PaginatedQuery {
    userId?: string;
    serviceId?: string;
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    startDate?: string;
    endDate?: string;
}
