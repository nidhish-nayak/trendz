import { createApp } from "../../utils/setup.util";
import authRoutes from "../../../../routes/auth.route";
import relationshipRoutes from "../../../../routes/relationship.route";

import { existingUserLogin } from "../../utils/auth.util";
import { customGet } from "../../utils/custom.util";

const app = createApp();

// Global variables
let user_id: number;
let token: string;

describe("Relationship controller GET tests", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        app.use("/api/relationships", relationshipRoutes);

        const login = await existingUserLogin(app);
        if (login.status !== 200) throw new Error("Failed existingUser login!");
        user_id = login.userId;
        token = login.token;
    });

    it("responds 200 for GET /api/relationships/", async () => {
        const endpoint = `/api/relationships/${user_id}`;
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });

    it("responds 200 for GET /api/relationships/ for another user", async () => {
        const endpoint = "/api/relationships/1";
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });
});
