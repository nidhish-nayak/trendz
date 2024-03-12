import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";

import config from "../../config/config";
import { zodMiddleware } from "../../middlewares/zod.middleware";

import authRoutes from "../../routes/auth.route";
import {
	DeregisterPass,
	RegisterInputFail,
	RegisterPass,
	RegisterUserExists,
} from "../../utils/test/authTest.utils";

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

describe("Auth controllers test", () => {
	beforeAll(async () => {
		// Tested Routes
		app.use("/api/auth", authRoutes);
	});

	it("responds with status 200 for GET /api/auth/register", async () => {
		const resInputValFail = await request(app)
			.post("/api/auth/register")
			.send(RegisterInputFail);
		expect(resInputValFail.status).toBe(400);

		const resExistingUser = await request(app)
			.post("/api/auth/register")
			.send(RegisterUserExists);
		expect(resExistingUser.status).toBe(409);

		const response = await request(app)
			.post("/api/auth/register")
			.send(RegisterPass);
		expect(response.status).toBe(200);
	});

	it("Login for register cleanup", async () => {
		const response = await request(app)
			.post("/api/auth/login")
			.send(DeregisterPass);

		userId = response.body.id;

		const cookies = response.headers["set-cookie"];
		accessToken = getAccessToken(cookies);

		expect(accessToken).toBeDefined();
		expect(response.status).toBe(200);
	});

	// Temporary
	it("Register cleanup", async () => {
		const response = await request(app)
			.post("/api/auth/deregister")
			.set("Cookie", [`accessToken=${accessToken}`])
			.send(DeregisterPass);

		expect(response.status).toBe(200);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
