import { Model, Document, SortOrder } from "mongoose";

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
    searchFields?: string[];
}

export interface PaginatedResponse<T> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    data: T[];
}

/**
 * Generic pagination utility for Mongoose models
 * @param model - Mongoose model to query
 * @param params - Pagination parameters
 * @param filter - Additional filter conditions
 * @param selectFields - Fields to include/exclude (e.g., "-passwordHash -__v")
 * @returns Paginated response with meta and data
 */
export async function paginate<T extends Document>(
    model: Model<T>,
    params: PaginationParams,
    filter: Record<string, any> = {},
    selectFields: string = ""
): Promise<PaginatedResponse<T>> {
    const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        search = "",
        searchFields = [],
    } = params;

    // Validate and sanitize pagination params
    const validPage = Math.max(1, Number(page));
    const validLimit = Math.min(100, Math.max(1, Number(limit))); // Max 100 items per page
    const skip = (validPage - 1) * validLimit;

    // Build search query
    let searchQuery: Record<string, any> = {};
    if (search && searchFields.length > 0) {
        searchQuery = {
            $or: searchFields.map((field) => ({
                [field]: { $regex: search, $options: "i" },
            })),
        };
    }

    // Combine filters
    const combinedFilter = {
        ...filter,
        ...searchQuery,
    };

    // Build sort object
    const sortOrder: SortOrder = order === "asc" ? 1 : -1;
    const sortObj: Record<string, SortOrder> = { [sort]: sortOrder };

    // Execute queries in parallel
    const [data, total] = await Promise.all([
        model
            .find(combinedFilter)
            .select(selectFields)
            .sort(sortObj)
            .skip(skip)
            .limit(validLimit)
            .lean()
            .exec(),
        model.countDocuments(combinedFilter).exec(),
    ]);

    const totalPages = Math.ceil(total / validLimit);

    return {
        meta: {
            page: validPage,
            limit: validLimit,
            total,
            totalPages,
        },
        data: data as T[],
    };
}

/**
 * Alternative: ApiFeatures class-based approach (more flexible for chaining)
 */
export class ApiFeatures<T extends Document> {
    private query: any;
    private queryString: PaginationParams;
    private model: Model<T>;

    constructor(model: Model<T>, queryString: PaginationParams) {
        this.model = model;
        this.query = model.find();
        this.queryString = queryString;
    }

    search(searchFields: string[]) {
        const { search } = this.queryString;
        if (search && searchFields.length > 0) {
            const searchQuery = {
                $or: searchFields.map((field) => ({
                    [field]: { $regex: search, $options: "i" },
                })),
            };
            this.query = this.query.find(searchQuery);
        }
        return this;
    }

    filter(additionalFilter: Record<string, any> = {}) {
        this.query = this.query.find(additionalFilter);
        return this;
    }

    sort() {
        const { sort = "createdAt", order = "desc" } = this.queryString;
        const sortOrder = order === "asc" ? 1 : -1;
        this.query = this.query.sort({ [sort]: sortOrder });
        return this;
    }

    select(fields: string) {
        if (fields) {
            this.query = this.query.select(fields);
        }
        return this;
    }

    paginate() {
        const { page = 1, limit = 10 } = this.queryString;
        const validPage = Math.max(1, Number(page));
        const validLimit = Math.min(100, Math.max(1, Number(limit)));
        const skip = (validPage - 1) * validLimit;

        this.query = this.query.skip(skip).limit(validLimit);
        return this;
    }

    async execute(): Promise<PaginatedResponse<T>> {
        const { page = 1, limit = 10 } = this.queryString;
        const validPage = Math.max(1, Number(page));
        const validLimit = Math.min(100, Math.max(1, Number(limit)));

        // Get the filter from the current query
        const filter = this.query.getFilter();

        const [data, total] = await Promise.all([
            this.query.lean().exec(),
            this.model.countDocuments(filter).exec(),
        ]);

        const totalPages = Math.ceil(total / validLimit);

        return {
            meta: {
                page: validPage,
                limit: validLimit,
                total,
                totalPages,
            },
            data: data as T[],
        };
    }
}
