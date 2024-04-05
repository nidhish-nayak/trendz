import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";

import { ExistingUser } from "$/config/test.config";
import config from "../config/config";
import { zodMiddleware } from "../middlewares/zod.middleware";

import activityRoutes from "../routes/activity.route";
import authRoutes from "../routes/auth.route";
import commentRoutes from "../routes/comment.route";
import friendRoutes from "../routes/friend.route";
import likeRoutes from "../routes/like.route";
import postRoutes from "../routes/post.route";
import relationshipRoutes from "../routes/relationship.route";
import statusRoutes from "../routes/status.route";
import storyRoutes from "../routes/story.route";
import userRoutes from "../routes/user.route";

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
let postIdArray: number[];
let followingIdArray: number[];

// Reusable function to parse accessToken from cookie
const getAccessToken = (cookies: string): string => {
	const filter1 = cookies[0].split("; ");
	const filter2 = filter1[0].split("=");
	const token = filter2[1];
	return token;
};

describe("Express application setup & Routes test", () => {
	beforeAll(async () => {
		// Auth for requests
		app.use("/api/auth", authRoutes);

		// LOGIN
		const response = await request(app).post("/api/auth/login").send({
			username: ExistingUser.username,
			password: ExistingUser.password,
		});

		userId = response.body.id;

		const cookies = response.headers["set-cookie"];
		accessToken = getAccessToken(cookies);
		if (!accessToken) throw new Error("Access token not found");

		// Tested Routes
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
	});

	// Test all Routes
	it("responds with status 200 for GET /api/test", async () => {
		const response = await request(app).get("/api/test");
		expect(response.status).toBe(200);
	});

	it("responds with status 200 for GET /api/posts", async () => {
		expect(accessToken).toBeDefined();
		expect(typeof accessToken).toBe("string");

		const response = await request(app)
			.get("/api/posts")
			.set("Cookie", [`accessToken=${accessToken}`]);

		type POST_TYPE = {
			id: number;
			desc: string;
			img: string;
			userId: number;
			createdAt: string;
			name: string;
			profilePic: string;
		};

		postIdArray = response.body.map((post: POST_TYPE) => post.id);

		expect(response.status).toBe(200);
	});

	it("responds with status 200 for GET /api/comments", async () => {
		const response = await request(app).get("/api/comments");
		expect(response.status).toBe(200);
	});

	it("responds with status 200 for GET /api/likes", async () => {
		expect(accessToken).toBeDefined();
		expect(typeof accessToken).toBe("string");

		postIdArray.map(async (postId) => {
			const response = await request(app)
				.get(`/api/likes?postId=${postId}&userId=${userId}`)
				.set("Cookie", [`accessToken=${accessToken}`]);

			expect(response.status).toBe(200);
		});
	});

	it("responds with status 200 for GET /api/friends", async () => {
		const response = await request(app)
			.get("/api/friends/following")
			.set("Cookie", [`accessToken=${accessToken}`]);

		type FOLLOWING_TYPES = {
			id: number;
			name: string;
			username: string;
			profilePic: string | null;
		};

		followingIdArray = response.body.map(
			(following: FOLLOWING_TYPES) => following.id
		);

		expect(response.status).toBe(200);
	});

	it("responds with status 200 for GET /api/relationships", async () => {
		const relationUsers = [...followingIdArray, userId];

		relationUsers.map(async (id) => {
			const response = await request(app)
				.get(`/api/relationships/${id}`)
				.set("Cookie", [`accessToken=${accessToken}`]);

			expect(response.status).toBe(200);
		});
	});

	it("responds with status 200 for GET /api/users", async () => {
		const response = await request(app)
			.get(`/api/users/find/${userId}`)
			.set("Cookie", [`accessToken=${accessToken}`]);

		expect(response.status).toBe(200);
	});

	it("responds with status 200 for GET /api/stories", async () => {
		const response = await request(app)
			.get(`/api/stories`)
			.set("Cookie", [`accessToken=${accessToken}`]);

		expect(response.status).toBe(200);
	});

	it("responds with status 200 for GET /api/activities", async () => {
		const response = await request(app)
			.get(`/api/activities`)
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
