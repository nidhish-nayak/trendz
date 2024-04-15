import authRoutes from "../../../../routes/auth.route";
import likeRoutes from "../../../../routes/like.route";
import postRoutes from "../../../../routes/post.route";
import { existingUserLogin } from "../../utils/auth.util";
import { customGet } from "../../utils/custom.util";
import { createApp } from "../../utils/setup.util";
import request from "supertest";

const app = createApp();

// Global variables
let user_id: number;
let token: string;
let post_id: number;

describe("Likes POST test cases", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        app.use("/api/likes", likeRoutes);
        app.use("/api/posts", postRoutes);

        const login = await existingUserLogin(app);
        if (login.status !== 200) throw Error("User login failed!");

        user_id = login.userId;
        token = login.token;
    });

    it("responds 400 to /api/likes with invalid inputs", async () => {
        const res = await request(app)
            .post("/api/likes")
            .set("Cookie", [`accessToken=${token}`])
            .send({ postId: true, userId: false });
        expect(res.status).toBe(400);
    });

    it("responds 200 to /api/likes with valid inputs", async () => {
        const posts = await customGet(app, "/api/posts", token);
        expect(posts.status).toBe(200);
        post_id = posts.body[0].id;

        const res = await request(app)
            .post("/api/likes")
            .set("Cookie", [`accessToken=${token}`])
            .send({ postId: post_id, userId: user_id });
        expect(res.status).toBe(200);
    });

    it("responds 401 to /api/likes for existing record", async () => {
        const res = await request(app)
            .post("/api/likes")
            .set("Cookie", [`accessToken=${token}`])
            .send({ postId: post_id, userId: user_id });
        expect(res.status).toBe(401);
    });

    it("responds 200 for DELETE on /api/likes", async () => {
        const res = await request(app)
            .delete(`/api/likes/${post_id}`)
            .set("Cookie", [`accessToken=${token}`]);
        expect(res.status).toBe(200);
    });

    it("responds 401 for DELETE on /api/likes for unliked post", async () => {
        const res = await request(app)
            .delete(`/api/likes/${post_id}`)
            .set("Cookie", [`accessToken=${token}`]);
        expect(res.status).toBe(401);
    });
});
