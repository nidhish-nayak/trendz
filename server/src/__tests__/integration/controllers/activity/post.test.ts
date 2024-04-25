import { createApp } from "../../utils/setup.util";
import request from "supertest";
import authRoutes from "../../../../routes/auth.route";
import activityRoutes from "../../../../routes/activity.route";
import { existingUserLogin } from "../../utils/auth.util";
import { supabase } from "$/db/connect";

// Initial setup
const app = createApp();

// Test globals
let user_id: number;
let accessToken: string;
let activity_id: number;

describe("Test POST activities controllers", () => {
    beforeAll(async () => {
        // Tested Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/activities", activityRoutes);

        // Login before testing routes
        const { userId, token, status } = await existingUserLogin(app);

        if (!token || !userId || status !== 200)
            throw new Error("Access token / id not found!");

        user_id = userId;
        accessToken = token;
    });

    it("responds with status 400 for POST /api/activities invalid inputs", async () => {
        const activityData = {
            table_name: false,
            message: "Added a new post",
            activity_created_at: "2024-03-25 18:32:04.747+00",
            user_id: user_id,
            post_id: 12,
            comment_id: undefined,
        };

        const res = await request(app)
            .post("/api/activities")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send(activityData);
        expect(res.status).toBe(400);
    });

    it("responds with status 401 for POST /api/activities invalid user_id", async () => {
        const activityData = {
            table_name: "posts",
            message: "Added a new post",
            activity_created_at: "2024-03-25 18:32:04.747+00",
            user_id: 0,
            post_id: 12,
            comment_id: undefined,
        };

        const res = await request(app)
            .post("/api/activities")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send(activityData);
        expect(res.status).toBe(401);
    });

    it("responds with status 200 for POST /api/activities", async () => {
        const activityData = {
            table_name: "posts",
            message: "Added a new post",
            activity_created_at: "2024-03-25 18:32:04.747+00",
            user_id: user_id,
            post_id: 12,
            comment_id: undefined,
        };

        const res = await request(app)
            .post("/api/activities")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send(activityData);
        expect(res.status).toBe(200);

        activity_id = res.body[0].id;
    });

    it("responds with status 200 for deleting activities", async () => {
        const { error } = await supabase
            .from("activities")
            .delete()
            .eq("id", activity_id);
        expect(error).toBe(null);
    });
});
