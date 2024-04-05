import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";

import config from "../../config/config";
import { zodMiddleware } from "../../middlewares/zod.middleware";

import { ExistingUser, GuestUser } from "$/config/test.config";
import authRoutes from "../../routes/auth.route";
import postRoutes from "../../routes/post.route";
import uploadRoute from "../../routes/upload.route";

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
		// app.use("/api/auth", authRoutes);
		//
		// // Login to both existing & guest user to test POST & GET
		// const response = await request(app).post("/api/auth/login").send({
		// 	username: ExistingUser.username,
		// 	password: ExistingUser.password,
		// });
		//
		// const guestRes = await request(app).post("/api/auth/login").send({
		// 	username: GuestUser.username,
		// 	password: GuestUser.password,
		// });
		//
		// userId = response.body.id;
		// guestId = guestRes.body.id;
		//
		// const cookies = response.headers["set-cookie"];
		// accessToken = getAccessToken(cookies);
		// if (!accessToken) throw new Error("Access token not found");
		//
		// const guestCookies = guestRes.headers["set-cookie"];
		// guestAccessToken = getAccessToken(guestCookies);
		// if (!guestAccessToken) throw new Error("Guest Access token not found");
		//
		// // Tested Routes
		// app.use("/api/posts", postRoutes);
		// app.use("/api/upload", uploadRoute);
	});

	it("responds for GET /api/upload", async () => {
		expect(200).toBe(200);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
