import { createApp } from "../../utils/setup.util";
import authRoutes from "../../../../routes/auth.route";
import commentRoutes from "../../../../routes/comment.route";

import { existingUserLogin } from "../../utils/auth.util";
import { customGet } from "../../utils/custom.util";

const app = createApp();

// Global variables
let user_id: number;
let token: string;

describe("Comments controller GET tests", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        app.use("/api/comments", commentRoutes);

        const login = await existingUserLogin(app);
        if (login.status !== 200) throw new Error("Failed existingUser login!");
        user_id = login.userId;
        token = login.token;
    });

    it("responds 200 for GET /api/comments/", async () => {
        const endpoint = "/api/comments/count?postId=1";
        const res = await customGet(app, endpoint, token);
        expect(res.status).toBe(200);
    });
});
