import request from "supertest";
import authRoutes from "../../../routes/auth.route";
import userRoutes from "../../../routes/user.route";

import { createApp } from "../../utils/setup.util";
import { existingUserLogin } from "../../utils/auth.util";
import { ExistingUser, GuestUser } from "$/__tests__/utils/config.util";

// Initial setup
const app = createApp();

// Test globals (Guest user to test post method unauthorized)
let userId: number | null;
let accessToken: string | null;

describe("Users controller PUT test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);

        const { userId: existingUserId, token: existingUserToken } =
            await existingUserLogin(app);

        // Update global values
        userId = existingUserId;
        accessToken = existingUserToken;

        // Tested Routes
        app.use("/api/users", userRoutes);
    });

    it("responds 400 for PUT /api/users with invalid inputs", async () => {
        const res = await request(app)
            .put("/api/users")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                id: true,
                name: false,
                username: false,
                email: 10,
            });
        expect(res.status).toBe(400);
    });

    it("responds 401 for PUT /api/users with other userId", async () => {
        const res = await request(app)
            .put("/api/users")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                id: 1,
                name: ExistingUser.name,
                username: ExistingUser.username,
                email: ExistingUser.email,
            });
        expect(res.status).toBe(401);
    });

    it("responds 409 for PUT /api/users with existing username", async () => {
        const res = await request(app)
            .put("/api/users")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                id: userId,
                name: ExistingUser.name,
                username: GuestUser.username,
                email: ExistingUser.email,
            });
        expect(res.status).toBe(409);
    });

    it("responds 200 for PUT /api/users", async () => {
        const res = await request(app)
            .put("/api/users")
            .set("Cookie", `accessToken=${accessToken}`)
            .send({
                id: userId,
                name: ExistingUser.name,
                username: ExistingUser.username,
                email: ExistingUser.email,
            });
        expect(res.status).toBe(200);
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
