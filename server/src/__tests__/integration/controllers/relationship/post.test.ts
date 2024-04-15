import request from "supertest";
import { createApp } from "../../utils/setup.util";
import { existingUserLogin } from "../../utils/auth.util";
import authRoutes from "../../../../routes/auth.route";
import relationshipRoutes from "../../../../routes/relationship.route";

const app = createApp();

// Global variables
let user_id: number;
let token: string;

describe("Relationship controller POST tests", () => {
    beforeAll(async () => {
        app.use("/api/auth", authRoutes);
        app.use("/api/relationships", relationshipRoutes);

        const login = await existingUserLogin(app);
        if (login.status !== 200) throw new Error("Failed existingUser login!");
        user_id = login.userId;
        token = login.token;
    });

    it("responds 400 for POST /api/relationships/ with invalid inputs", async () => {
        const endpoint = "/api/relationships/";
        const res = await request(app)
            .post(endpoint)
            .set("Cookie", [`accessToken=${token}`])
            .send({ followerUserId: user_id, followedUserId: false });
        expect(res.status).toBe(400);
    });

    it("responds 401 for POST /api/relationships/ with another user", async () => {
        const endpoint = "/api/relationships/";
        const res = await request(app)
            .post(endpoint)
            .set("Cookie", [`accessToken=${token}`])
            .send({ followerUserId: 1, followedUserId: 2 });
        expect(res.status).toBe(401);
    });

    it("responds 200 for POST /api/relationships/ with correct inputs", async () => {
        const endpoint = "/api/relationships/";
        const res = await request(app)
            .post(endpoint)
            .set("Cookie", [`accessToken=${token}`])
            .send({ followerUserId: 2, followedUserId: 1 });
        expect(res.status).toBe(200);
    });

    it("responds 400 for POST /api/relationships/ for existing record", async () => {
        const endpoint = "/api/relationships/";
        const res = await request(app)
            .post(endpoint)
            .set("Cookie", [`accessToken=${token}`])
            .send({ followerUserId: 2, followedUserId: 1 });
        expect(res.status).toBe(400);
    });

    it("responds 200 for DELETE /api/relationships/:followedId", async () => {
        const endpoint = "/api/relationships/1";
        const res = await request(app)
            .delete(endpoint)
            .set("Cookie", [`accessToken=${token}`]);
        expect(res.status).toBe(200);
    });
});
