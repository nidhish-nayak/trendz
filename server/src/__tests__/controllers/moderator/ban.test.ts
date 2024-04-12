import request from "supertest";
import config from "$/config/config";
import { supabase } from "$/db/connect";
import authRoutes from "../../../routes/auth.route";
import postRoutes from "../../../routes/post.route";
import storyRoutes from "../../../routes/story.route";

import { createApp } from "$/__tests__/utils/setup.util";
import { testConfig, userAlt } from "$/__tests__/utils/test.util";
import { manualAuth } from "$/__tests__/utils/auth.util";
import moderatorCheck from "$/utils/moderator.util";

// Initial setup
const app = createApp();

// Global variables
let user_id: number;
let accessToken: string;
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

        await request(app).post("/api/auth/register").send(userAlt);
        const { userId, token } = await manualAuth(
            app,
            "/api/auth/login",
            credentials
        );

        if (!userId || !token)
            return console.log("Login failed - no token returned!");
        user_id = userId;
        accessToken = token;
    });

    // One test to rule them all
    // Must be executed in series hence one IT statement
    it("responds 200 for posts ban success", async () => {
        const imgUrl = testConfig.banImg;
        const { data: postData, error: postError } = await supabase
            .from("posts")
            .insert({
                desc: "test ban",
                img: imgUrl,
                userId: user_id,
            })
            .select();
        if (postError) return console.log("Post upload to DB has failed!");

        // Call moderator - Main test
        await moderatorCheck(postData[0].id, "posts", user_id, imgUrl);
        //
        // const logout = await request(app).post("/api/auth/logout");
        // expect(logout.status).toBe(200);
        //
        // const response = await request(app)
        //     .post("/api/auth/login")
        //     .send(credentials);
        // expect(response.status).toBe(401);
        //
        // // Remove banned user
        // const { error: banError } = await supabase
        //     .from("bans")
        //     .delete()
        //     .eq("user_id", user_id);
        // if (banError) return console.log("User unban failed!");
        //
        // const { data, error } = await supabase
        //     .from("stories")
        //     .insert({
        //         img: imgUrl,
        //         userId: user_id,
        //     })
        //     .select();
        // if (error) return console.log("Story upload to DB has failed!");
        //
        // // Call moderator - Main test
        // await moderatorCheck(data[0].id, "stories", user_id, imgUrl);
        //
        // const res = await request(app)
        //     .post("/api/auth/login")
        //     .send(credentials);
        // expect(res.status).toBe(401);
        //
        // const removeBan = await supabase
        //     .from("bans")
        //     .delete()
        //     .eq("user_id", user_id);
        // expect(removeBan.status).toBe(204);
        //
        // const { status } = await manualAuth(
        //     app,
        //     "/api/auth/deregister",
        //     credentials,
        //     accessToken
        // );
        // expect(status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            done();
        });
    });
});
