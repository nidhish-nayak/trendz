import fs from "fs";
import request from "supertest";

import authRoutes from "../../../routes/auth.route";
import postRoutes from "../../../routes/post.route";
import uploadRoute from "../../../routes/upload.route";
import userRoutes from "../../../routes/user.route";

import { existingUserLogin, guestUserLogin } from "../../utils/auth.util";
import { createFile, createLargeFile } from "../../utils/file.util";
import { createApp } from "../../utils/setup.util";
import { testConfig } from "$/__tests__/utils/test.util";

// Initial setup
const app = createApp();

// Test globals (Guest user to test post method unauthorized)
let userId: number;
let guestId: number;
let accessToken: string;
let guestAccessToken: string;

describe("Upload controllers test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);

        // Login to both guest & existing user
        const { userId: existingUserId, token: existingUserToken } =
            await existingUserLogin(app);
        const { userId: guestUserId, token: guestUserToken } =
            await guestUserLogin(app);

        // Update global values
        userId = existingUserId;
        guestId = guestUserId;
        accessToken = existingUserToken;
        guestAccessToken = guestUserToken;

        // Tested Routes
        app.use("/api/posts", postRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/upload", uploadRoute);
    });

    it("responds 200 for POST /api/upload", async () => {
        // Create temp file
        const { file, path } = createFile();

        const response = await request(app)
            .post("/api/upload")
            .set("Cookie", `accessToken=${accessToken}`)
            .field("folder", "test")
            .attach("file", file);

        // Delete in-memory file created
        fs.unlinkSync(path);
        expect(response.status).toBe(200);
    });

    it("responds 401 for guest POST /api/upload", async () => {
        // Create temp file
        const { file, path } = createFile();

        const guestRes = await request(app)
            .post("/api/upload")
            .set("Cookie", `accessToken=${guestAccessToken}`)
            .field("folder", "test")
            .attach("file", file);

        // Delete in-memory file created
        fs.unlinkSync(path);
        expect(guestRes.status).toBe(401);
    });

    it("responds 400 for POST /api/upload with no image", async () => {
        const res = await request(app)
            .post("/api/upload")
            .set("Cookie", `accessToken=${accessToken}`)
            .field("folder", "test");
        expect(res.status).toBe(400);
    });

    it("responds 500 for POST /api/upload for >1MB image", async () => {
        const { file, path } = createLargeFile();

        const res = await request(app)
            .post("/api/upload")
            .set("Cookie", `accessToken=${accessToken}`)
            .field("folder", "test")
            .attach("file", file);

        fs.unlinkSync(path);
        expect(res.status).toBe(500);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            done();
        });
    });
});
