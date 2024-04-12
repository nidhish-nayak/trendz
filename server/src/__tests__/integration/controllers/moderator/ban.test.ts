import config from "$/config/config";
import { supabase } from "$/db/connect";
import request from "supertest";

import authRoutes from "../../../../routes/auth.route";
import postRoutes from "../../../../routes/post.route";
import storyRoutes from "../../../../routes/story.route";

import { manualAuth } from "$/__tests__/integration/utils/auth.util";
import { testConfig, userAlt } from "$/__tests__/integration/utils/config.util";
import { createApp } from "$/__tests__/integration/utils/setup.util";
import moderatorCheck from "$/utils/moderator.util";

// Initial setup
const app = createApp();

// Global variables
let user_id: number;
let post_id: number;
let story_id: number;
let accessToken: string;
const imgUrl = testConfig.banImg;
const credentials = {
    username: userAlt.username,
    password: userAlt.password,
};

describe("Ban moderator test", () => {
    beforeAll(async () => {
        if (config.modOptions.modStatus === false) {
            return;
        }

        app.use("/api/auth", authRoutes);
        app.use("/api/posts", postRoutes);
        app.use("/api/stories", storyRoutes);

        // Register the user before test
        await request(app).post("/api/auth/register").send(userAlt);
    });

    it("responds 200 for user login", async () => {
        const { userId, token } = await manualAuth(
            app,
            "/api/auth/login",
            credentials
        );

        if (!userId || !token)
            return console.log("Login failed - no token returned!");
        user_id = userId;
        accessToken = token;
        expect(user_id).toBeDefined();
        expect(accessToken).toBeDefined();
    });

    it("adds a new post for mocking ban scenario", async () => {
        const { data, error } = await supabase
            .from("posts")
            .insert({
                desc: "test ban",
                img: imgUrl,
                userId: user_id,
            })
            .select();
        if (error) return console.log("Post upload to DB has failed!");
        post_id = data[0].id;
        expect(post_id).toBeDefined();
    });

    it("bans the user after posting post with unsafe image", async () => {
        // Ban user after posting imgUrl
        await expect(
            moderatorCheck(post_id, "posts", user_id, imgUrl)
        ).resolves.toBeUndefined();

        // Verify user is banned and not able to login
        const login = await request(app)
            .post("/api/auth/login")
            .send(credentials);
        expect(login.status).toBe(401);
    });

    it("removes the user from banned records", async () => {
        // Remove banned user
        const removeBan = await supabase
            .from("bans")
            .delete()
            .eq("user_id", user_id);
        expect(removeBan.status).toBe(204);
    });

    it("adds a new story for mocking ban scenario", async () => {
        const { data, error } = await supabase
            .from("stories")
            .insert({
                img: imgUrl,
                userId: user_id,
            })
            .select();
        if (error) return console.log("Story upload to DB has failed!");
        story_id = data[0].id;
        expect(story_id).toBeDefined();
    });

    it("bans the user after posting story with unsafe image", async () => {
        // Ban user after posting imgUrl
        await expect(
            moderatorCheck(story_id, "stories", user_id, imgUrl)
        ).resolves.toBeUndefined();

        // Verify user is banned and not able to login
        const login = await request(app)
            .post("/api/auth/login")
            .send(credentials);
        expect(login.status).toBe(401);
    });

    it("cleanup - remove ban & deregister test user", async () => {
        const removeBan = await supabase
            .from("bans")
            .delete()
            .eq("user_id", user_id);
        expect(removeBan.status).toBe(204);

        const { status } = await manualAuth(
            app,
            "/api/auth/deregister",
            credentials,
            accessToken
        );
        expect(status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            done();
        });
    });
});
