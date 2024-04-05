import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";
import fs from "fs";
import path from "path";

import config from "../../config/config";
import { zodMiddleware } from "../../middlewares/zod.middleware";

import { ExistingUser, GuestUser, testConfig } from "$/config/test.config";
import authRoutes from "../../routes/auth.route";
import postRoutes from "../../routes/post.route";
import userRoutes from "../../routes/user.route";
import uploadRoute from "../../routes/upload.route";
import axios from "axios";

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
	if (!cookies) throw Error("Login failed for Guest/User");

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

		const cookies = response.headers["set-cookie"];
		accessToken = getAccessToken(cookies);
		if (!accessToken) throw new Error("Access token not found");

		const guestCookies = guestRes.headers["set-cookie"];
		guestAccessToken = getAccessToken(guestCookies);
		if (!guestAccessToken) throw new Error("Guest Access token not found");

		// Tested Routes
		app.use("/api/posts", postRoutes);
		app.use("/api/users", userRoutes);
		app.use("/api/upload", uploadRoute);
	});

	it("responds for post /api/upload", async () => {
		const path = testConfig.upload.path;
		const data = testConfig.upload.data;

		// Create a temparory file in-memory
		fs.writeFileSync(path, data);
		const file = fs.createReadStream(path);

		const response = await request(app)
			.post("/api/upload")
			.set("Cookie", `accessToken=${accessToken}`)
			.field("folder", "test")
			.attach("file", file);

		// Delete in-memory file created
		fs.unlinkSync(path);
		expect(response.status).toBe(200);
	});

	it("responds for guest post /api/upload", async () => {
		const path = testConfig.upload.path;
		const data = testConfig.upload.data;

		// Create temp file
		fs.writeFileSync(path, data);
		const file = fs.createReadStream(path);

		const guestRes = await request(app)
			.post("/api/upload")
			.set("Cookie", `accessToken=${guestAccessToken}`)
			.field("folder", "test")
			.attach("file", file);

		// Delete in-memory file created
		fs.unlinkSync(path);
		expect(guestRes.status).toBe(401);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
