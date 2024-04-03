import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";

import config from "../../config/config";
import { zodMiddleware } from "../../middlewares/zod.middleware";

import { ExistingUser, GuestUser, testConfig } from "$/config/test.config";
import authRoutes from "../../routes/auth.route";
import postRoutes from "../../routes/post.route";
import { createFile } from "../utils/fileOperations.util";

// Configs
const app: Application = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.corsOptions));
app.use(cookieParser());
app.use(zodMiddleware);

// Test Globals (Guest user to test post method unauthorized)
let accessToken: string;
let guestAccessToken: string;
let userId: number;
let guestId: number;

// Reusable function to parse accessToken from cookie
const getAccessToken = (cookies: string): string => {
	const filter1 = cookies[0].split("; ");
	const filter2 = filter1[0].split("=");
	const token = filter2[1];
	return token;
};

describe("Post controllers test", () => {
	beforeAll(async () => {
		app.use("/api/auth", authRoutes);

		// Login to both existing & guest user to test POST & GET
		const response = await request(app).post("/api/auth/login").send({
			username: ExistingUser.username,
			password: ExistingUser.password,
		});

		const guestRes = await request(app).post("/api/auth/login").send({
			username: GuestUser.username,
			password: GuestUser.password,
		});

		userId = response.body.id;
		guestId = guestRes.body.id;

		const cookies = await response.headers["set-cookie"];
		accessToken = getAccessToken(cookies);
		if (!accessToken) throw new Error("Access token not found");

		const guestCookies = await guestRes.headers["set-cookie"];
		guestAccessToken = getAccessToken(guestCookies);
		if (!guestAccessToken) throw new Error("Guest Access token not found");

		// Tested Routes
		app.use("/api/posts", postRoutes);
	});

	it("responds for GET /api/posts", async () => {
		const resNoCookie = await request(app).get("/api/posts");
		expect(resNoCookie.status).toBe(401);
		const exploreResNoCookie = await request(app).get("/api/posts/explore");
		expect(exploreResNoCookie.status).toBe(401);

		// GET ALL POSTS
		const response = await request(app)
			.get("/api/posts")
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(response.status).toBe(200);

		// GET EXPLORE POSTS
		const exploreRes = await request(app)
			.get("/api/posts/explore")
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(exploreRes.status).toBe(200);

		// GET POST DATA TO TEST SINGLE POST
		const posts = response.body;
		const getSingleRes = await request(app)
			.get(`/api/posts/${posts[0]}`)
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(getSingleRes.status).toBe(200);
	});

	it("responds for POST /api/posts", async () => {
		const filePath = testConfig.posts.testImagePath;
		const fileStream = fs.createReadStream(filePath);

		createFile(); // Creating a mock file
		const result = fs.readFileSync(filePath);
		expect(JSON.parse(JSON.stringify(result)).type).toBe("Buffer");

		// Getting the file to upload to post
		const formData = new FormData();
		formData.append("image", fileStream);

		// Send the post request with image file
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
