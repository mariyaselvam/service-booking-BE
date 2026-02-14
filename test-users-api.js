/**
 * Test script for GET ALL USERS API
 * Run this after the server is started to test the endpoints
 */

const BASE_URL = "http://localhost:3000";

async function testGetAllUsersAPI() {
    console.log("🧪 Testing GET ALL USERS API\n");

    const tests = [
        {
            name: "1. Get all users (default pagination)",
            url: `${BASE_URL}/api/users`,
        },
        {
            name: "2. Get users with custom pagination",
            url: `${BASE_URL}/api/users?page=1&limit=5`,
        },
        {
            name: "3. Search users by name/email",
            url: `${BASE_URL}/api/users?search=john`,
        },
        {
            name: "4. Sort users by fullName ascending",
            url: `${BASE_URL}/api/users?sort=fullName&order=asc`,
        },
        {
            name: "5. Filter by role",
            url: `${BASE_URL}/api/users?role=CUSTOMER`,
        },
        {
            name: "6. Filter by status",
            url: `${BASE_URL}/api/users?status=ACTIVE`,
        },
        {
            name: "7. Combined: search + filter + sort",
            url: `${BASE_URL}/api/users?search=test&role=CUSTOMER&sort=createdAt&order=desc&page=1&limit=10`,
        },
        {
            name: "8. Get user statistics",
            url: `${BASE_URL}/api/users/stats`,
        },
    ];

    for (const test of tests) {
        try {
            console.log(`\n${test.name}`);
            console.log(`URL: ${test.url}`);

            const response = await fetch(test.url);
            const data = await response.json();

            if (response.ok) {
                console.log("✅ Status:", response.status);
                if (data.meta) {
                    console.log("📊 Meta:", JSON.stringify(data.meta, null, 2));
                    console.log(`📝 Data count: ${data.data.length}`);
                    if (data.data.length > 0) {
                        console.log("👤 First user:", {
                            fullName: data.data[0].fullName,
                            email: data.data[0].email,
                            role: data.data[0].role,
                        });
                        // Verify sensitive fields are excluded
                        if (data.data[0].passwordHash) {
                            console.log("❌ ERROR: passwordHash is exposed!");
                        } else {
                            console.log("✅ Security: passwordHash is hidden");
                        }
                    }
                } else if (data.data) {
                    console.log("📊 Response:", JSON.stringify(data.data, null, 2));
                }
            } else {
                console.log("❌ Error:", response.status, data);
            }
        } catch (error) {
            console.log("❌ Request failed:", error.message);
        }
    }

    console.log("\n\n✨ Testing complete!");
}

// Run tests
testGetAllUsersAPI().catch(console.error);
