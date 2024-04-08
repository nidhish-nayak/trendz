import request from "supertest";
import authRoutes from "../../../routes/auth.route";
import postRoutes from "../../../routes/post.route";
import uploadRoute from "../../../routes/upload.route";
import { existingUserLogin } from "../../utils/auth.util";
import { createApp } from "$/__tests__/utils/setup.util";
import { GET_ALL_POSTS_TYPES } from "$/__tests__/utils/types.util";

// Initial setup
const app = createApp();

// Test globals
let accessToken: string | null;
let posts: GET_ALL_POSTS_TYPES | null;

describe("Post controllers test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);

        // Tested Routes
        app.use("/api/posts", postRoutes);
        app.use("/api/upload", uploadRoute);
    });

    // Login before getting posts
    it("responds 200 for user login to check get posts", async () => {
        const { token, status } = await existingUserLogin(app);
        expect(status).toBe(200);
        accessToken = token;
    });

    it("responds 401 for GET all posts with no token", async () => {
        const resNoCookie = await request(app).get("/api/posts");
        expect(resNoCookie.status).toBe(401);

        const exploreResNoCookie = await request(app).get("/api/posts/explore");
        expect(exploreResNoCookie.status).toBe(401);
    });

    it("responds 200 for GET all posts on /api/posts", async () => {
        const response = await request(app)
            .get("/api/posts")
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
        posts = response.body;
    });

    it("responds 200 for GET explore posts on /api/posts/explore", async () => {
        const exploreRes = await request(app)
            .get("/api/posts/explore")
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(exploreRes.status).toBe(200);
    });

    it("responds 200 for GET single post on /api/posts/${postId}", async () => {
        if (!posts) throw Error("No posts found!");
        const getSingleRes = await request(app)
            .get(`/api/posts/${posts[0]}`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(getSingleRes.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            accessToken = null;
            posts = null;
            done();
        });
    });
});
