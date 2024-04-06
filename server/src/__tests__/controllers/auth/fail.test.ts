import authRoutes from "../../../routes/auth.route";
import { ExistingUser, userAlt } from "../../utils/test.util";
import { manualAuth } from "../../utils/auth.util";
import { createApp } from "../../utils/setup.util";

// Initial setup
const app = createApp();

// Globals to test
let accessToken: string;

// Auth negative test cases
describe("Auth controllers test", () => {
	beforeAll(async () => {
		// Tested routes
		app.use("/api/auth", authRoutes);

		// Registers an alternate user
		const { status } = await manualAuth(app, "/api/auth/register", userAlt);
		if (status !== 200) throw Error("Auth fail checks - register failed");
	});

	// Test register
	it("responds 400 for POST /api/auth/register with invalid inputs", async () => {
		const { status } = await manualAuth(app, "/api/auth/register", {
			name: "name",
			email: "email",
			username: 10,
			password: false,
		});
		expect(status).toBe(400);
	});

	it("responds 409 for POST /api/auth/register with existing user", async () => {
		const { status } = await manualAuth(app, "/api/auth/register", {
			name: ExistingUser.name,
			email: ExistingUser.email,
			username: ExistingUser.username,
			password: ExistingUser.password,
		});
		expect(status).toBe(409);
	});

	// Test login
	it("responds 400 for POST /api/auth/login with invalid inputs", async () => {
		const { status } = await manualAuth(app, "/api/auth/login", {
			username: 10,
			password: false,
		});
		expect(status).toBe(400);
	});

	it("responds 404 for POST /api/auth/login with non-existent user record", async () => {
		const { status } = await manualAuth(app, "/api/auth/login", {
			username: userAlt.username + "_unknown",
			password: userAlt.password,
		});
		expect(status).toBe(404);
	});

	it("responds 401 for POST /api/auth/login with wrong password", async () => {
		const { status } = await manualAuth(app, "/api/auth/login", {
			username: userAlt.username,
			password: userAlt.password + "_invalid",
		});
		expect(status).toBe(401);
	});

	// Login to check deregister
	it("responds 200 for POST /api/auth/login with correct password", async () => {
		const {
			userId: id,
			token,
			status,
		} = await manualAuth(app, "/api/auth/login", {
			username: userAlt.username,
			password: userAlt.password,
		});

		expect(status).toBe(200);
		expect(id).toBeDefined();
		expect(token).toBeDefined();

		if (status === 200 && token) {
			accessToken = token;
		} else throw new Error("User login failed - Auth fail checks");
	});

	// Test delete account
	it("responds 401 for POST /api/auth/deregister with no access token", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{
				username: userAlt.username,
				password: userAlt.password,
			},
			null
		);
		expect(status).toBe(401);
	});

	it("responds 400 for POST /api/auth/deregister with invalid inputs", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{ username: 10, password: true },
			accessToken
		);
		expect(status).toBe(400);
	});

	it("responds 404 for POST /api/auth/deregister with unauthorized credentials", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{
				username: userAlt.username + "_unknown",
				password: userAlt.password,
			},
			accessToken
		);
		expect(status).toBe(404);
	});

	it("responds 401 for POST /api/auth/deregister with another user record", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{
				username: ExistingUser.username,
				password: ExistingUser.password,
			},
			accessToken
		);
		expect(status).toBe(401);
	});

	it("responds 401 for POST /api/auth/deregister with wrong password", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{
				username: userAlt.username,
				password: userAlt.password + "_invalid",
			},
			accessToken
		);
		expect(status).toBe(401);
	});

	it("responds 200 for POST /api/auth/deregister with correct password", async () => {
		const { status } = await manualAuth(
			app,
			"/api/auth/deregister",
			{
				username: userAlt.username,
				password: userAlt.password,
			},
			accessToken
		);
		expect(status).toBe(200);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
