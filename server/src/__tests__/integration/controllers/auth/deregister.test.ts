import authRoutes from "../../../../routes/auth.route";
import {
    existingUserLogin,
    manualAuth,
} from "../../../integration/utils/auth.util";
import { ExistingUser } from "../../../integration/utils/config.util";
import { createApp } from "../../../integration/utils/setup.util";

// Initial setup
const app = createApp();

// Globals to test
let accessToken: string | null;

// Deregister pass test is already covered in register.test.ts
describe("Auth deregister controller fail test", () => {
    beforeAll(async () => {
        // Tested routes
        app.use("/api/auth", authRoutes);
    });

    // Login before testing deregister
    it("responds 200 for POST /api/auth/login with correct user credentials", async () => {
        const { token, status } = await existingUserLogin(app);
        expect(status).toBe(200);
        if (status === 200 && token) accessToken = token;
    });

    // Negative cases
    it("responds 401 for POST /api/auth/deregister with no access token", async () => {
        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            {
                username: ExistingUser.username,
                password: ExistingUser.password,
            },
            null
        );
        expect(status).toBe(401);
    });

    it("responds 400 for POST /api/auth/deregister with invalid inputs", async () => {
        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            { username: 10, password: true },
            accessToken
        );
        expect(status).toBe(400);
    });

    it("responds 404 for POST /api/auth/deregister with unauthorized credentials", async () => {
        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            {
                username: ExistingUser.username + "_unknown",
                password: ExistingUser.password,
            },
            accessToken
        );
        expect(status).toBe(404);
    });

    it("responds 401 for POST /api/auth/deregister with wrong password", async () => {
        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            {
                username: ExistingUser.username,
                password: ExistingUser.password + "_invalid",
            },
            accessToken
        );
        expect(status).toBe(401);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            accessToken = null;
            done();
        });
    });
});
