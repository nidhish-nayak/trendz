import { ExistingUser, GuestUser } from "$/config/test.config";
import { Application } from "express";
import request from "supertest";

// Reusable function to parse accessToken from cookie
export const getAccessToken = (cookies: string): string => {
	if (!cookies) throw Error("Login failed for Guest/User");
	const filter1 = cookies[0].split("; ");
	const filter2 = filter1[0].split("=");
	const token = filter2[1];
	return token;
};

// Reusable Login Components
export const existingUserLogin = async (app: Application) => {
	const response = await request(app).post("/api/auth/login").send({
		username: ExistingUser.username,
		password: ExistingUser.password,
	});

	const userId = response.body.id;

	const cookies = response.headers["set-cookie"];
	const accessToken = getAccessToken(cookies);
	if (!accessToken) throw new Error("Access token not found");

	return { userId: userId, token: accessToken };
};

export const guestUserLogin = async (app: Application) => {
	const response = await request(app).post("/api/auth/login").send({
		username: GuestUser.username,
		password: GuestUser.password,
	});

	const userId = response.body.id;

	const cookies = response.headers["set-cookie"];
	const accessToken = getAccessToken(cookies);
	if (!accessToken) throw new Error("Guest access token not found");

	return { userId: userId, token: accessToken };
};

type MANUAL_AUTH_TYPES = {
	name?: string | boolean | number | null | undefined;
	email?: string | boolean | number | null | undefined;
	username: string | boolean | number | null | undefined;
	password: string | boolean | number | null | undefined;
};

export const manualAuth = async (
	app: Application,
	endpoint: string,
	data: MANUAL_AUTH_TYPES,
	status: number
): Promise<void | { userId: number; token: string }> => {
	const response = await request(app).post(endpoint).send(data);
	expect(response.status).toBe(status);

	if (status === 200) {
		const userId = response.body.id;
		const cookies = response.headers["set-cookie"];
		const accessToken = getAccessToken(cookies);

		expect(accessToken).toBeDefined();
		return { userId: userId, token: accessToken };
	}
};
