import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";

import config from "../../config/config";
import { zodMiddleware } from "../../middlewares/zod.middleware";

import { ExistingUser } from "$/config/test.config";
import authRoutes from "../../routes/auth.route";
import postRoutes from "../../routes/post.route";

// Configs
const app: Application = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.corsOptions));
app.use(cookieParser());
app.use(zodMiddleware);

// Test Globals
let accessToken: string;
let userId: number;

// Reusable function to parse accessToken from cookie
const getAccessToken = (cookies: string): string => {
	const filter1 = cookies[0].split("; ");
	const filter2 = filter1[0].split("=");
	const token = filter2[1];
	return token;
};

describe("Post controllers test", () => {
	beforeAll(async () => {
		// Login before testing posts
		app.use("/api/auth", authRoutes);
		const response = await request(app).post("/api/auth/login").send({
			username: ExistingUser.username,
			password: ExistingUser.password,
		});

		userId = response.body.id;

		const cookies = response.headers["set-cookie"];
		accessToken = getAccessToken(cookies);
		if (!accessToken) throw new Error("Access token not found");

		// Tested Routes
		app.use("/api/posts", postRoutes);
	});

	it("responds for GET /api/posts", async () => {
		const resNoCookie = await request(app).get("/api/posts");
		expect(resNoCookie.status).toBe(401);

		const response = await request(app)
			.get("/api/posts")
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(response.status).toBe(200);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
