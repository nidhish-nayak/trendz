import request from "supertest";
import authRoutes from "../../../routes/auth.route";
import uploadRoute from "../../../routes/upload.route";
import storyRoutes from "../../../routes/story.route";
import { existingUserLogin } from "../../utils/auth.util";
import { createApp } from "$/__tests__/utils/setup.util";
import { testConfig } from "$/__tests__/utils/test.util";

// Initial setup
const app = createApp();

// Test globals
let accessToken: string | null;
let storyId: number | null;

describe("Story controllers POST test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);

        // Tested Routes
        app.use("/api/stories", storyRoutes);
        app.use("/api/upload", uploadRoute);
    });

    // Login before getting posts
    it("responds 200 for user login to check get stories", async () => {
        const { token, status } = await existingUserLogin(app);
        expect(status).toBe(200);
        accessToken = token;
    });

    it("responds 401 for POST /api/stories with no token", async () => {
        const resNoCookie = await request(app)
            .post("/api/stories")
            .send({ img: "test" });
        expect(resNoCookie.status).toBe(401);
    });

    it("responds 401 for POST /api/stories with invalid inputs", async () => {
        const res = await request(app)
            .post("/api/stories")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send({ img: true });
        expect(res.status).toBe(401);
    });

    it("responds 401 for POST /api/stories with no prefix", async () => {
        const res = await request(app)
            .post("/api/stories")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send({ img: "no_prefix" });
        expect(res.status).toBe(401);
    });

    it("responds 200 for POST /api/stories with correct input", async () => {
        const res = await request(app)
            .post("/api/stories")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send({ img: testConfig.s3Path.stories + "/test.png" });
        expect(res.status).toBe(200);
        storyId = res.body[0].id;
    });

    it("responds 401 for DELETE /api/stories with no token", async () => {
        const res = await request(app).delete(`/api/stories/${storyId}`);
        expect(res.status).toBe(401);
    });

    it("responds 401 for DELETE /api/stories with non-existing storyId", async () => {
        const res = await request(app)
            .delete("/api/stories/0")
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(res.status).toBe(401);
    });

    it("responds 200 for DELETE /api/stories", async () => {
        const res = await request(app)
            .delete(`/api/stories/${storyId}`)
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(res.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            accessToken = null;
            storyId = null;
            done();
        });
    });
});
