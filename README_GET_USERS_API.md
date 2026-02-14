# GET ALL USERS API - Quick Start

## 🎯 What Was Implemented

A production-ready GET ALL USERS API with:
- ✅ Pagination (page, limit)
- ✅ Sorting (any field, asc/desc)
- ✅ Search (fullName, email)
- ✅ Filtering (role, status)
- ✅ Clean architecture (Controller → Service → Model)
- ✅ Reusable pagination utility
- ✅ TypeScript type safety
- ✅ Security (sensitive fields excluded)

## 📁 Files Created/Modified

### New Files
1. **`src/utils/pagination.ts`** - Reusable pagination utility (works with any Mongoose model)
2. **`src/services/user.service.ts`** - User business logic layer
3. **`src/controllers/user.controller.ts`** - User HTTP request handlers
4. **`src/routes/user.routes.ts`** - User route definitions
5. **`docs/GET_ALL_USERS_API.md`** - Complete documentation
6. **`test-users-api.js`** - API test script

### Modified Files
1. **`src/app.ts`** - Added user routes

## 🚀 Quick Test

### 1. Start the server (if not running)
```bash
npm run dev
```

### 2. Test the API

**Get all users:**
```bash
curl http://localhost:3000/api/users
```

**With pagination:**
```bash
curl "http://localhost:3000/api/users?page=1&limit=10"
```

**With search:**
```bash
curl "http://localhost:3000/api/users?search=john"
```

**With sorting:**
```bash
curl "http://localhost:3000/api/users?sort=fullName&order=asc"
```

**With filters:**
```bash
curl "http://localhost:3000/api/users?role=CUSTOMER&status=ACTIVE"
```

**Get user stats:**
```bash
curl http://localhost:3000/api/users/stats
```

### 3. Run automated tests
```bash
node test-users-api.js
```

## 📊 Response Format

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
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "tier": "SILVER",
      "walletBalance": 0,
      "lifetimeSpend": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** `passwordHash` and `__v` are automatically excluded!

## 🔄 Reuse for Other Models

The pagination utility is fully reusable. Example for Services:

```typescript
// In service.service.ts
import { paginate } from "../utils/pagination";

async getAllServices(params: PaginationParams) {
    return paginate<IService>(
        Service,
        params,
        {},
        "-__v"
    );
}
```

See `docs/GET_ALL_USERS_API.md` for complete reusability examples.

## 🎨 Architecture

```
┌─────────────────────────────────────────┐
│  GET /api/users?page=1&limit=10         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  user.controller.ts                     │
│  - Extract query params                 │
│  - Call service layer                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  user.service.ts                        │
│  - Business logic                       │
│  - Call pagination utility              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  pagination.ts                          │
│  - Build MongoDB query                  │
│  - Execute with filters/sort/search     │
│  - Return formatted response            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  User Model (Mongoose)                  │
└─────────────────────────────────────────┘
```

## 📝 Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max: 100) |
| `sort` | string | "createdAt" | Field to sort by |
| `order` | "asc"\|"desc" | "desc" | Sort order |
| `search` | string | "" | Search in fullName and email |
| `role` | string | - | Filter by role |
| `status` | string | - | Filter by status |

## 🔐 Security Features

- ✅ `passwordHash` excluded from all responses
- ✅ `__v` (version key) excluded
- ✅ Max limit enforced (100 items per page)
- ✅ Input sanitization on pagination params
- ✅ Uses `.lean()` for performance and security

## 📚 Full Documentation

See **`docs/GET_ALL_USERS_API.md`** for:
- Complete API reference
- Reusability patterns for other models
- Best practices
- Database indexing recommendations
- Advanced usage examples
- Future enhancement ideas

## ✅ Next Steps

1. **Test the API** - Use the test script or cURL commands above
2. **Add indexes** - For better performance on search/filter fields
3. **Reuse the pattern** - Apply to Services, Bookings, etc.
4. **Add authentication** - Protect routes with JWT middleware
5. **Add validation** - Use Zod/Joi for query param validation

---

**Need help?** Check `docs/GET_ALL_USERS_API.md` for detailed documentation.
