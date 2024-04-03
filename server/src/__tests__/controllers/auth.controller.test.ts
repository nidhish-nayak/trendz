import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import request from "supertest";

import config from "../../config/config";
import { zodMiddleware } from "../../middlewares/zod.middleware";

import {
	DeregisterAnotherUser,
	DeregisterInputFail,
	DeregisterPass,
	DeregisterUnauthorized,
	DeregisterWrongPassword,
	LoginInputFail,
	LoginUserDoesNotExist,
	LoginUserPass,
	LoginWrongPassword,
	RegisterInputFail,
	RegisterPass,
	RegisterUserExists,
} from "../../config/test.config";
import authRoutes from "../../routes/auth.route";

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

describe("Auth controllers test", () => {
	beforeAll(async () => {
		// Tested Routes
		app.use("/api/auth", authRoutes);
	});

	// Test Register User
	it("responds for POST /api/auth/register", async () => {
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

	// Test Login User
	it("responds for POST /api/auth/login", async () => {
		const resInputValFail = await request(app)
			.post("/api/auth/login")
			.send(LoginInputFail);
		expect(resInputValFail.status).toBe(400);

		const resNonExistingUser = await request(app)
			.post("/api/auth/login")
			.send(LoginUserDoesNotExist);
		expect(resNonExistingUser.status).toBe(404);

		const resWrongPassword = await request(app)
			.post("/api/auth/login")
			.send(LoginWrongPassword);
		expect(resWrongPassword.status).toBe(401);

		const response = await request(app)
			.post("/api/auth/login")
			.send(LoginUserPass);

		userId = response.body.id;

		const cookies = response.headers["set-cookie"];
		accessToken = getAccessToken(cookies);

		expect(accessToken).toBeDefined();
		expect(response.status).toBe(200);
	});

	// Test User Logout
	it("responds for POST /api/auth/logout", async () => {
		const response = await request(app).post("/api/auth/logout");
		expect(response.status).toBe(200);
	});

	// Test delete user account
	it("responds for POST /api/auth/deregister", async () => {
		const resNoCookie = await request(app)
			.post("/api/auth/deregister")
			.send(DeregisterPass);
		expect(resNoCookie.status).toBe(401);

		const resInputValFail = await request(app)
			.post("/api/auth/deregister")
			.set("Cookie", [`accessToken=${accessToken}`])
			.send(DeregisterInputFail);
		expect(resInputValFail.status).toBe(400);

		const resUnauthorized = await request(app)
			.post("/api/auth/deregister")
			.set("Cookie", [`accessToken=${accessToken}`])
			.send(DeregisterUnauthorized);
		expect(resUnauthorized.status).toBe(404);

		const resAnotherUser = await request(app)
			.post("/api/auth/deregister")
			.set("Cookie", [`accessToken=${accessToken}`])
			.send(DeregisterAnotherUser);
		expect(resAnotherUser.status).toBe(401);

		const resWrongPassword = await request(app)
			.post("/api/auth/deregister")
			.set("Cookie", [`accessToken=${accessToken}`])
			.send(DeregisterWrongPassword);
		expect(resWrongPassword.status).toBe(401);

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
