import { createApp } from "../../utils/setup.util";
import authRoutes from "../../../../routes/auth.route";
import friendRoutes from "../../../../routes/friend.route";

import { existingUserLogin } from "../../utils/auth.util";
import { customGet } from "../../utils/custom.util";

const app = createApp();

// Global variables
let user_id: number;
let token: string;

describe("Friends controller GET tests", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        app.use("/api/friends", friendRoutes);

        const login = await existingUserLogin(app);
        if (login.status !== 200) throw new Error("Failed existingUser login!");
        user_id = login.userId;
        token = login.token;
    });

    it("responds 200 for GET /api/friends/", async () => {
        const endpoint = "/api/friends/";
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });

    it("responds 200 for GET /api/friends/followers", async () => {
        const endpoint = "/api/friends/followers";
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });

    it("responds 200 for GET /api/friends/following", async () => {
        const endpoint = "/api/friends/following";
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });

    it("responds 200 for GET /api/friends/findPeople", async () => {
        const endpoint = "/api/friends/findPeople";
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });
});
