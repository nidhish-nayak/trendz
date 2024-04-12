import request from "supertest";
import authRoutes from "../../../../routes/auth.route";
import { manualAuth } from "../../../integration/utils/auth.util";
import { ExistingUser } from "../../../integration/utils/config.util";
import { createApp } from "../../../integration/utils/setup.util";

// Initial setup
const app = createApp();

// Globals to test
let userId: number | null;
let accessToken: string | null;

describe("Auth login & logout controller test", () => {
    beforeAll(async () => {
        // Tested routes
        app.use("/api/auth", authRoutes);
    });

    // Negative cases
    it("responds 400 for POST /api/auth/login with invalid inputs", async () => {
        const { status } = await manualAuth(app, "/api/auth/login", {
            username: 10,
            password: false,
        });
        expect(status).toBe(400);
    });

    it("responds 404 for POST /api/auth/login with non-existent user record", async () => {
        const { status } = await manualAuth(app, "/api/auth/login", {
            username: ExistingUser.username + "_unknown",
            password: ExistingUser.password,
        });
        expect(status).toBe(404);
    });

    it("responds 401 for POST /api/auth/login with wrong password", async () => {
        const { status } = await manualAuth(app, "/api/auth/login", {
            username: ExistingUser.username,
            password: ExistingUser.password + "_invalid",
        });
        expect(status).toBe(401);
    });

    // Positive case
    it("responds 200 for POST /api/auth/login with correct user crendentials", async () => {
        const {
            userId: id,
            token,
            status,
        } = await manualAuth(app, "/api/auth/login", {
            username: ExistingUser.username,
            password: ExistingUser.password,
        });

        expect(id).toBeDefined();
        expect(token).toBeDefined();
        expect(status).toBe(200);

        if (status === 200 && id && token) {
            userId = id;
            accessToken = token;
        } else {
            throw new Error("User login test failed!");
        }
    });

    // Positive case for logout
    it("responds 200 for POST /api/auth/logout", async () => {
        const response = await request(app).post("/api/auth/logout");
        expect(response.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            userId = null;
            accessToken = null;
            done();
        });
    });
});
