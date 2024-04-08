import request from "supertest";
import authRoutes from "../../../routes/auth.route";
import postRoutes from "../../../routes/post.route";

import { guestUserLogin } from "../../utils/auth.util";
import { createApp } from "../../utils/setup.util";

// Initial setup
const app = createApp();

// Test globals
let guestId: number | null;
let guestAccessToken: string | null;

describe("Post controllers test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        // Tested Routes
        app.use("/api/posts", postRoutes);
    });

    it("responds 200 for POST /api/auth/login", async () => {
        const { userId, token, status } = await guestUserLogin(app);
        expect(status).toBe(200);

        guestId = userId;
        guestAccessToken = token;
    });

    it("responds 401 for POST /api/posts", async () => {
        const postData = {
            img: null,
            desc: "test",
            userId: guestId,
            fileName: null,
        };

        const addPostGuest = await request(app)
            .post("/api/posts")
            .set("Cookie", [`accessToken=${guestAccessToken}`])
            .send(postData);
        expect(addPostGuest.status).toBe(401);
    });

    it("responds 401 for DELETE /api/posts/1", async () => {
        const deletePostGuest = await request(app)
            .delete(`/api/posts/1`)
            .set("Cookie", [`accessToken=${guestAccessToken}`]);
        expect(deletePostGuest.status).toBe(401);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            guestId = null;
            guestAccessToken = null;
            done();
        });
    });
});
