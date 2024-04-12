import authRoutes from "../../../routes/auth.route";
import { manualAuth } from "../../utils/auth.util";
import { createApp } from "../../utils/setup.util";
import { ExistingUser, user } from "../../utils/config.util";

// Initial setup
const app = createApp();

// Global variables
let accessToken: string | null;

describe("Auth register & deregister controller test", () => {
    beforeAll(async () => {
        // Tested routes
        app.use("/api/auth", authRoutes);
    });

    // Negative cases
    it("responds 400 for POST /api/auth/register with invalid inputs", async () => {
        const { status } = await manualAuth(app, "/api/auth/register", {
            name: "name",
            email: "email",
            username: 10,
            password: false,
        });
        expect(status).toBe(400);
    });

    it("responds 409 for POST /api/auth/register with existing user", async () => {
        const { status } = await manualAuth(app, "/api/auth/register", {
            name: ExistingUser.name,
            email: ExistingUser.email,
            username: ExistingUser.username,
            password: ExistingUser.password,
        });
        expect(status).toBe(409);
    });

    // Positive case
    it("responds 200 for POST /api/auth/register with correct user credentials", async () => {
        const { status } = await manualAuth(app, "/api/auth/register", {
            name: user.name,
            email: user.email,
            username: user.username,
            password: user.password,
        });
        expect(status).toBe(200);
    });

    // Login to deregister
    it("responds 200 for POST /api/auth/login with correct user credentials", async () => {
        const { token, status } = await manualAuth(app, "/api/auth/login", {
            username: user.username,
            password: user.password,
        });
        expect(status).toBe(200);

        if (status === 200 && token) {
            accessToken = token;
        }
    });

    // Checking negative case where token != user record
    it("responds 401 for POST /api/auth/deregister with another user record", async () => {
        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            {
                username: ExistingUser.username,
                password: ExistingUser.password,
            },
            accessToken
        );
        expect(status).toBe(401);
    });

    // Deregister logged user
    it("responds 200 for POST /api/auth/deregister with correct user credentials", async () => {
        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            { username: user.username, password: user.password },
            accessToken
        );
        expect(accessToken).toBeDefined();
        expect(status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            accessToken = null;
            done();
        });
    });
});
