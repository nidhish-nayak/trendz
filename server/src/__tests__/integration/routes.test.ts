import { existingUserLogin } from "./utils/auth.util";
import { customGet } from "./utils/custom.util";
import { createApp } from "./utils/setup.util";
import { FOLLOWING_TYPES, POST_TYPE } from "./utils/types.util";

import activityRoutes from "../../routes/activity.route";
import authRoutes from "../../routes/auth.route";
import commentRoutes from "../../routes/comment.route";
import friendRoutes from "../../routes/friend.route";
import likeRoutes from "../../routes/like.route";
import postRoutes from "../../routes/post.route";
import relationshipRoutes from "../../routes/relationship.route";
import statusRoutes from "../../routes/status.route";
import storyRoutes from "../../routes/story.route";
import userRoutes from "../../routes/user.route";

// Initial setup
const app = createApp();

// Test globals
let userId: number;
let token: string;
let postIdArray: number[];
let followingIdArray: number[];

describe("Express application all routes test", () => {
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

        // Login before testing routes
        const {
            userId: id,
            token: accessToken,
            status,
        } = await existingUserLogin(app);

        if (!accessToken || !id || status !== 200)
            throw new Error("Access token / id not found!");

        userId = id;
        token = accessToken;
    });

    // Test all Routes
    it("responds with status 200 for GET /api/test", async () => {
        const response = await customGet(app, "/api/test");
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/auth/status", async () => {
        const response = await customGet(app, "/api/auth/status", token);
        expect(response.status).toBe(200);

        const resNoToken = await customGet(app, "/api/auth/status");
        expect(resNoToken.status).toBe(200);
        expect(resNoToken.body.token).toBe(false);
    });

    it("responds with status 200 for GET /api/posts", async () => {
        const response = await customGet(app, "/api/posts", token);

        postIdArray = response.body.map((post: POST_TYPE) => post.id);
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/comments", async () => {
        const response = await customGet(app, "/api/comments");
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/likes", async () => {
        if (!postIdArray) throw new Error("PostId array not found!");
        if (postIdArray.length < 1) return;

        postIdArray.slice(0, 3);
        postIdArray.map(async (postId) => {
            const endpoint = `/api/likes?postId=${postId}&userId=${userId}`;
            const response = await customGet(app, endpoint, token);
            expect(response.status).toBe(200);
        });
    });

    it("responds with status 200 for GET /api/friends", async () => {
        const response = await customGet(app, "/api/friends/following", token);
        followingIdArray = response.body.map(
            (following: FOLLOWING_TYPES) => following.id
        );
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/relationships", async () => {
        if (!followingIdArray) throw Error("followingId array not found!");
        if (followingIdArray.length < 1) return;

        let relationUsers = [...followingIdArray, userId];
        relationUsers = relationUsers.slice(0, 3);
        relationUsers.map(async (id) => {
            const endpoint = `/api/relationships/${id}`;
            const response = await customGet(app, endpoint, token);
            expect(response.status).toBe(200);
        });
    });

    it("responds with status 200 for GET /api/users", async () => {
        const endpoint = `/api/users/find/${userId}`;
        const response = await customGet(app, endpoint, token);
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/stories", async () => {
        const response = await customGet(app, "/api/stories", token);
        expect(response.status).toBe(200);
    });

    it("responds with status 200 for GET /api/activities", async () => {
        const response = await customGet(app, "/api/activities", token);
        expect(response.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            done();
        });
    });
});
