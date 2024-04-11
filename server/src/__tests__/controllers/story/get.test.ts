import request from "supertest";
import authRoutes from "../../../routes/auth.route";
import storyRoutes from "../../../routes/story.route";
import { existingUserLogin } from "../../utils/auth.util";
import { createApp } from "$/__tests__/utils/setup.util";

// Initial setup
const app = createApp();

// Test globals
let accessToken: string | null;

describe("Story controllers GET test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);

        // Tested Routes
        app.use("/api/stories", storyRoutes);
    });

    // Login before getting stories
    it("responds 200 for user login to check get stories", async () => {
        const { token, status } = await existingUserLogin(app);
        expect(status).toBe(200);
        accessToken = token;
    });

    it("responds 401 for GET all stories with no token", async () => {
        const resNoCookie = await request(app).get("/api/stories");
        expect(resNoCookie.status).toBe(401);
    });

    it("responds 200 for GET all posts on /api/stories", async () => {
        const response = await request(app)
            .get("/api/stories")
            .set("Cookie", [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            accessToken = null;
            done();
        });
    });
});
