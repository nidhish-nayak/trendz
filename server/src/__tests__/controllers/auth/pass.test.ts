import request from "supertest";
import authRoutes from "../../../routes/auth.route";
import { manualAuth } from "../../utils/auth.util";
import { createApp } from "../../utils/setup.util";
import { user } from "$/__tests__/utils/test.util";

// Initial setup
const app = createApp();

// Globals to test
let userId: number;
let accessToken: string;

// All positive auth test cases
describe("Auth controllers test", () => {
	beforeAll(async () => {
		// Tested routes
		app.use("/api/auth", authRoutes);
	});

	// Test register user
	it("responds 200 for POST /api/auth/register with correct user credentials", async () => {
		const { status } = await manualAuth(app, "/api/auth/register", {
			name: user.name,
			email: user.email,
			username: user.username,
			password: user.password,
		});
		expect(status).toBe(200);
	});

	// Test login user
	it("responds 200 for POST /api/auth/login with correct user crendentials", async () => {
		const {
			userId: id,
			token,
			status,
		} = await manualAuth(app, "/api/auth/login", {
			username: user.username,
			password: user.password,
		});

		expect(id).toBeDefined();
		expect(token).toBeDefined();
		expect(status).toBe(200);

		if (status === 200 && id && token) {
			userId = id;
			accessToken = token;
		} else {
			throw new Error("User login test failed!");
		}
	});

	// Test user logout - simple test case hence manualAuth is not used
	it("responds 200 for POST /api/auth/logout", async () => {
		const response = await request(app).post("/api/auth/logout");
		expect(response.status).toBe(200);
	});

	// Test delete user account
	it("responds 200 for POST /api/auth/deregister with correct user credentials", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{ username: user.username, password: user.password },
			accessToken
		);
		expect(accessToken).toBeDefined();
		expect(status).toBe(200);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
