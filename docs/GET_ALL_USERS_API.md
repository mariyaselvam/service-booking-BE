# GET ALL USERS API - Documentation

## Overview
This document describes the implementation of a production-ready GET ALL USERS API with pagination, sorting, and searching capabilities following clean architecture principles.

## Architecture

### Layer Structure
```
controllers/user.controller.ts  → HTTP layer (handles requests/responses)
services/user.service.ts        → Business logic layer
utils/pagination.ts             → Reusable pagination utility
models/User.ts                  → Data model
routes/user.routes.ts           → Route definitions
```

## API Endpoints

### 1. GET /api/users
Get all users with pagination, sorting, and search.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (starts from 1) |
| `limit` | number | 10 | Items per page (max: 100) |
| `sort` | string | "createdAt" | Field to sort by |
| `order` | "asc" \| "desc" | "desc" | Sort order |
| `search` | string | "" | Search term (searches in fullName and email) |
| `role` | string | - | Filter by user role (ADMIN, CUSTOMER, VENDOR) |
| `status` | string | - | Filter by status (ACTIVE, BLOCKED) |

#### Example Requests

**Basic pagination:**
```bash
GET /api/users?page=1&limit=10
```

**With search:**
```bash
GET /api/users?search=john&page=1&limit=10
```

**With sorting:**
```bash
GET /api/users?sort=fullName&order=asc&page=1&limit=20
```

**With filters:**
```bash
GET /api/users?role=CUSTOMER&status=ACTIVE&page=1&limit=10
```

**Combined:**
```bash
GET /api/users?search=john&role=CUSTOMER&sort=createdAt&order=desc&page=1&limit=10
```

#### Response Format
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "role": "CUSTOMER",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "tier": "SILVER",
      "walletBalance": 0,
      "lifetimeSpend": 0,
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more users
  ]
}
```

**Note:** Sensitive fields (`passwordHash`, `__v`) are automatically excluded from the response.

### 2. GET /api/users/:id
Get a specific user by ID.

#### Example Request
```bash
GET /api/users/507f1f77bcf86cd799439011
```

#### Response Format
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "role": "CUSTOMER",
    "fullName": "John Doe",
    "email": "john@example.com",
    // ... other user fields
  }
}
```

### 3. GET /api/users/stats
Get user statistics.

#### Example Request
```bash
GET /api/users/stats
```

#### Response Format
```json
{
  "data": {
    "total": 150,
    "activeUsers": 140,
    "blockedUsers": 10,
    "roleDistribution": {
      "CUSTOMER": 120,
      "VENDOR": 25,
      "ADMIN": 5
    }
  }
}
```

## Reusability Pattern

### Using the Pagination Utility for Other Models

The `paginate` utility can be used with any Mongoose model. Here's how to implement it for other collections:

#### Example: Services Collection

**1. Create Service Model** (`models/Service.ts`):
```typescript
import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
    name: string;
    description: string;
    category: string;
    price: number;
    vendorId: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: Date;
}

const serviceSchema = new Schema<IService>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        vendorId: { type: String, required: true },
        status: { type: String, default: "ACTIVE" },
    },
    { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
```

**2. Create Service Service** (`services/service.service.ts`):
```typescript
import { Service, IService } from "../models/Service";
import { paginate, PaginationParams, PaginatedResponse } from "../utils/pagination";

export class ServiceService {
    async getAllServices(
        params: PaginationParams,
        additionalFilter: Record<string, any> = {}
    ): Promise<PaginatedResponse<IService>> {
        // Define searchable fields for services
        const searchFields = ["name", "description", "category"];
        
        // Fields to exclude (if any)
        const selectFields = "-__v";
        
        return paginate<IService>(
            Service,
            params,
            additionalFilter,
            selectFields
        );
    }
}

export const serviceService = new ServiceService();
```

**3. Create Service Controller** (`controllers/service.controller.ts`):
```typescript
import { Request, Response } from "express";
import { serviceService } from "../services/service.service";
import { PaginationParams } from "../utils/pagination";

export const getAllServices = async (req: Request, res: Response) => {
    const paginationParams: PaginationParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sort: (req.query.sort as string) || "createdAt",
        order: (req.query.order as "asc" | "desc") || "desc",
        search: (req.query.search as string) || "",
    };

    const additionalFilter: any = {};
    
    if (req.query.category) {
        additionalFilter.category = req.query.category;
    }
    
    if (req.query.status) {
        additionalFilter.status = req.query.status;
    }
    
    if (req.query.vendorId) {
        additionalFilter.vendorId = req.query.vendorId;
    }

    const result = await serviceService.getAllServices(paginationParams, additionalFilter);
    res.json(result);
};
```

**4. Create Service Routes** (`routes/service.routes.ts`):
```typescript
import { Router } from "express";
import { getAllServices } from "../controllers/service.controller";

const router = Router();
router.get("/", getAllServices);

export default router;
```

**5. Register Routes** (in `app.ts`):
```typescript
import serviceRoutes from "./routes/service.routes";
app.use("/api/services", serviceRoutes);
```

## Alternative: Using ApiFeatures Class

For more complex scenarios, you can use the `ApiFeatures` class:

```typescript
import { ApiFeatures } from "../utils/pagination";
import { User, IUser } from "../models/User";

async function getUsers(queryParams: any) {
    const features = new ApiFeatures<IUser>(User, queryParams)
        .search(["fullName", "email"])
        .filter({ status: "ACTIVE" })
        .sort()
        .select("-passwordHash -__v")
        .paginate();
    
    return await features.execute();
}
```

## Best Practices

### 1. Security
- ✅ Sensitive fields (`passwordHash`) are excluded from responses
- ✅ Input validation on pagination params (max limit: 100)
- ✅ Use of `.lean()` for better performance

### 2. Performance
- ✅ Parallel execution of count and find queries
- ✅ Indexed fields for search (ensure indexes on `fullName`, `email`)
- ✅ Limit maximum items per page

### 3. Type Safety
- ✅ Full TypeScript support with generics
- ✅ Proper typing for pagination params and responses
- ✅ Type-safe filter objects

### 4. Maintainability
- ✅ Separation of concerns (controller → service → model)
- ✅ Reusable pagination utility
- ✅ Consistent response format
- ✅ Well-documented code

## Testing Examples

### Using cURL

```bash
# Get first page of users
curl "http://localhost:3000/api/users?page=1&limit=10"

# Search for users
curl "http://localhost:3000/api/users?search=john"

# Filter by role
curl "http://localhost:3000/api/users?role=CUSTOMER"

# Sort by name ascending
curl "http://localhost:3000/api/users?sort=fullName&order=asc"

# Get user by ID
curl "http://localhost:3000/api/users/507f1f77bcf86cd799439011"

# Get user stats
curl "http://localhost:3000/api/users/stats"
```

### Using JavaScript/Fetch

```javascript
// Get paginated users
async function getUsers(page = 1, limit = 10, search = "") {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
    });
    
    const response = await fetch(`/api/users?${params}`);
    const data = await response.json();
    return data;
}

// Usage
const result = await getUsers(1, 10, "john");
console.log(`Total users: ${result.meta.total}`);
console.log(`Users:`, result.data);
```

## Database Indexes

For optimal performance, add these indexes to your User collection:

```javascript
// In MongoDB shell or migration script
db.users.createIndex({ fullName: "text", email: "text" });
db.users.createIndex({ role: 1 });
db.users.createIndex({ status: 1 });
db.users.createIndex({ createdAt: -1 });
```

Or in your User model:

```typescript
userSchema.index({ fullName: "text", email: "text" });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });
```

## Error Handling

All endpoints use the global error handler middleware. Errors are automatically caught by `express-async-errors`.

Common error responses:
- `404 Not Found` - User not found (GET /api/users/:id)
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server errors

## Future Enhancements

1. **Field Selection**: Allow clients to specify which fields to return
   ```
   GET /api/users?fields=fullName,email,role
   ```

2. **Advanced Filtering**: Support for range queries
   ```
   GET /api/users?walletBalance[gte]=100&walletBalance[lte]=1000
   ```

3. **Multiple Sort Fields**:
   ```
   GET /api/users?sort=tier,-createdAt
   ```

4. **Caching**: Add Redis caching for frequently accessed pages

5. **Rate Limiting**: Implement rate limiting per user/IP

## Summary

This implementation provides:
- ✅ Clean, maintainable architecture
- ✅ Fully reusable across all models
- ✅ Type-safe with TypeScript
- ✅ Production-ready with security best practices
- ✅ Comprehensive pagination, sorting, and search
- ✅ Consistent API response format
- ✅ Easy to extend and customize
