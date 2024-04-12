import request from "supertest";
import { createApp } from "../../utils/setup.util";
import authRoutes from "../../../routes/auth.route";
import userRoutes from "../../../routes/user.route";
import postRoutes from "../../../routes/post.route";
import uploadRoute from "../../../routes/upload.route";
import { guestUserLogin } from "../../utils/auth.util";

// Initial setup
const app = createApp();

// Test globals
let guestAccessToken: string | null;
let guestId: number | null;

describe("Auth middleware guest user test", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/upload", uploadRoute);
        app.use("/api/posts", postRoutes);
    });

    it("responds 200 for POST /api/auth/login", async () => {
        const { userId, token, status } = await guestUserLogin(app);
        expect(status).toBe(200);
        guestAccessToken = token;
        guestId = userId;
    });

    it("responds 401 for POST requests", async () => {
        const res = await request(app)
            .post("/api/upload")
            .set("Cookie", [`accessToken=${guestAccessToken}`]);
        expect(res.status).toBe(401);
        expect(res.body).toBe("Read Only!");
    });

    it("responds 401 for PUT requests", async () => {
        const res = await request(app)
            .put("/api/users")
            .set("Cookie", [`accessToken=${guestAccessToken}`]);
        expect(res.status).toBe(401);
        expect(res.body).toBe("Read Only!");
    });

    it("responds 401 for DELETE requests", async () => {
        const res = await request(app)
            .delete("/api/posts/0")
            .set("Cookie", [`accessToken=${guestAccessToken}`]);
        expect(res.status).toBe(401);
        expect(res.body).toBe("Read Only!");
    });

    it("responds 200 for GET requests", async () => {
        const res = await request(app)
            .get("/api/posts?page=1")
            .set("Cookie", [`accessToken=${guestAccessToken}`]);
        expect(res.status).toBe(200);
    });

    it("responds 200 for POST requests on /api/users/onlineUsers", async () => {
        const res = await request(app)
            .post("/api/users/onlineUsers")
            .set("Cookie", [`accessToken=${guestAccessToken}`])
            .send([guestId]);
        expect(res.status).toBe(200);
    });

    it("responds 200 for POST requests /api/users/onlineUsers for 2 users", async () => {
        const res = await request(app)
            .post("/api/users/onlineUsers")
            .set("Cookie", [`accessToken=${guestAccessToken}`])
            .send([1, guestId]);
        expect(res.status).toBe(200);
    });

    afterAll(() => {
        return new Promise<void>((done) => {
            // Clean up any resources if necessary
            guestAccessToken = null;
            guestId = null;
            done();
        });
    });
});
