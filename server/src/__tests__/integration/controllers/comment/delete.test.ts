import { createApp } from "../../utils/setup.util";
import authRoutes from "../../../../routes/auth.route";
import commentRoutes from "../../../../routes/comment.route";
import request from "supertest";
import { existingUserLogin } from "../../utils/auth.util";

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

    it("responds 401 for DELETE /api/comments", async () => {
        const deleteComment = await request(app)
            .delete(`/api/comments/1`)
            .set("Cookie", [`accessToken=${token}`]);
        expect(deleteComment.status).toBe(401);
    });

    it("responds 401 for DELETE /api/comments doesnt exist", async () => {
        const deleteComment = await request(app)
            .delete(`/api/comments/0`)
            .set("Cookie", [`accessToken=${token}`]);
        expect(deleteComment.status).toBe(401);
    });
});
