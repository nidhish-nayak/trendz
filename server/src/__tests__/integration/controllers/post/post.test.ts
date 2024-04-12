import request from "supertest";
import authRoutes from "../../../../routes/auth.route";
import postRoutes from "../../../../routes/post.route";
import uploadRoute from "../../../../routes/upload.route";

import { existingUserLogin } from "$/__tests__/integration/utils/auth.util";
import { testConfig } from "$/__tests__/integration/utils/config.util";
import { createApp } from "$/__tests__/integration/utils/setup.util";
import { POST_DATA } from "$/__tests__/integration/utils/types.util";

// Initial setup
const app = createApp();

// Test globals
let userId: number | null;
let postId: number | null;
let postIdImg: number | null;
let accessToken: string | null;
let postData: POST_DATA | null;

describe("Post controllers test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        // Tested Routes
        app.use("/api/posts", postRoutes);
        app.use("/api/upload", uploadRoute);
    });

    it("responds for POST /api/auth/login", async () => {
        const { userId: id, token, status } = await existingUserLogin(app);
        expect(status).toBe(200);
        userId = id;
        accessToken = token;

        postData = {
            img: null,
            desc: "test",
            userId: userId,
            filename: null,
        };
    });

    it("responds for POST /api/posts", async () => {
        if (!postData) throw Error("Post data not found!");

        const addPostNoCookie = await request(app)
            .post("/api/posts")
            .send(postData);
        expect(addPostNoCookie.status).toBe(401);

        const addPostInvalidInput = await request(app)
            .post("/api/posts")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send({ img: true, desc: 10, userId: "invalid", filename: false });
        expect(addPostInvalidInput.status).toBe(401);

        const postImage = {
            img: "test",
            desc: "test",
            userId: userId,
            filename: "test",
        };

        // Check post image prefix
        const addPostSecure = await request(app)
            .post("/api/posts")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send(postImage);
        expect(addPostSecure.status).toBe(401);

        const addPost = await request(app)
            .post("/api/posts")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send(postData);
        expect(addPost.status).toBe(200);
        expect(typeof addPost.body[0].id).toBe("number");

        postId = addPost.body[0].id;
    });

    it("responds for POST /api/posts/ with image", async () => {
        postData = {
            img: testConfig.s3Path.posts + "/test-image.png",
            desc: "test image",
            userId: userId,
            filename: "test-image",
        };

        const response = await request(app)
            .post("/api/posts")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send(postData);
        expect(response.status).toBe(200);
        expect(typeof response.body[0].id).toBe("number");

        postIdImg = response.body[0].id;
    });

    it("responds for DELETE /api/posts/${postId}", async () => {
        const deletePostNoCookie = await request(app).delete(
            `/api/posts/${postId}`
        );
        expect(deletePostNoCookie.status).toBe(401);

        const deletePost = await request(app)
            .delete(`/api/posts/${postId}`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(deletePost.status).toBe(200);

        const deletePostImg = await request(app)
            .delete(`/api/posts/${postIdImg}`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(deletePostImg.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            postData = null;
            userId = null;
            postId = null;
            postIdImg = null;
            accessToken = null;
            done();
        });
    });
});
