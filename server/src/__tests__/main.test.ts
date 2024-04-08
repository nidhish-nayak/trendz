import request from "supertest";
import { createApp } from "./utils/setup.util";
import { existingUserLogin } from "./utils/auth.util";
import activityRoutes from "../routes/activity.route";
import authRoutes from "../routes/auth.route";
import commentRoutes from "../routes/comment.route";
import friendRoutes from "../routes/friend.route";
import likeRoutes from "../routes/like.route";
import postRoutes from "../routes/post.route";
import relationshipRoutes from "../routes/relationship.route";
import statusRoutes from "../routes/status.route";
import storyRoutes from "../routes/story.route";
import userRoutes from "../routes/user.route";
import { FOLLOWING_TYPES, POST_TYPE } from "./utils/types.util";

// Initial setup
const app = createApp();

// Test globals
let userId: number | null;
let accessToken: string | null;
let postIdArray: number[] | null;
let followingIdArray: number[] | null;

describe("Express application setup & routes test", () => {
    beforeAll(async () => {
        // Tested Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/test", statusRoutes);
        app.use("/api/auth", authRoutes);
        app.use("/api/posts", postRoutes);
        app.use("/api/comments", commentRoutes);
        app.use("/api/likes", likeRoutes);
        app.use("/api/relationships", relationshipRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/stories", storyRoutes);
        app.use("/api/friends", friendRoutes);
        app.use("/api/activities", activityRoutes);
    });

    // Login before testing routes
    it("responds with status 200 for /api/auth/login", async () => {
        const { userId: id, token, status } = await existingUserLogin(app);
        expect(status).toBe(200);

        if (!token || !id) throw new Error("Access token / id not found!");
        userId = id;
        accessToken = token;
    });

    // Test all Routes
    it("responds with status 200 for GET /api/test", async () => {
        const response = await request(app).get("/api/test");
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/posts", async () => {
        expect(accessToken).toBeDefined();
        expect(typeof accessToken).toBe("string");

        const response = await request(app)
            .get("/api/posts")
            .set("Cookie", [`accessToken=${accessToken}`]);
        postIdArray = response.body.map((post: POST_TYPE) => post.id);
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/comments", async () => {
        const response = await request(app).get("/api/comments");
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/likes", async () => {
        expect(accessToken).toBeDefined();
        expect(typeof accessToken).toBe("string");

        if (!postIdArray) throw Error("postId array not found!");
        postIdArray.map(async (postId) => {
            const response = await request(app)
                .get(`/api/likes?postId=${postId}&userId=${userId}`)
                .set("Cookie", [`accessToken=${accessToken}`]);
            expect(response.status).toBe(200);
        });
    });

    it("responds with status 200 for GET /api/friends", async () => {
        const response = await request(app)
            .get("/api/friends/following")
            .set("Cookie", [`accessToken=${accessToken}`]);

        followingIdArray = response.body.map(
            (following: FOLLOWING_TYPES) => following.id
        );
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/relationships", async () => {
        if (!followingIdArray) throw Error("followingId array not found!");
        const relationUsers = [...followingIdArray, userId];

        relationUsers.map(async (id) => {
            const response = await request(app)
                .get(`/api/relationships/${id}`)
                .set("Cookie", [`accessToken=${accessToken}`]);
            expect(response.status).toBe(200);
        });
    });

    it("responds with status 200 for GET /api/users", async () => {
        const response = await request(app)
            .get(`/api/users/find/${userId}`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/stories", async () => {
        const response = await request(app)
            .get(`/api/stories`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/activities", async () => {
        const response = await request(app)
            .get(`/api/activities`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessarylet userId: number;
            userId = null;
            accessToken = null;
            postIdArray = null;
            followingIdArray = null;
            done();
        });
    });
});
