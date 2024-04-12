import { Application } from "express";
import request from "supertest";
import { ExistingUser, GuestUser } from "./config.util";
import {
    MANUAL_AUTH_RETURN_TYPES,
    MANUAL_INPUT_DATA_TYPES,
} from "./types.util";

// Reusable function to parse accessToken from cookie
export const getAccessToken = (cookies: string): string => {
    if (!cookies) throw Error("Login failed for Guest/User");
    const filter1 = cookies[0].split("; ");
    const filter2 = filter1[0].split("=");
    const token = filter2[1];
    return token;
};

// Reusable login components
export const existingUserLogin = async (app: Application) => {
    const response = await request(app).post("/api/auth/login").send({
        username: ExistingUser.username,
        password: ExistingUser.password,
    });

    const userId = response.body.id;

    const cookies = response.headers["set-cookie"];
    const accessToken = getAccessToken(cookies);
    if (!accessToken) throw new Error("Access token not found");

    return { userId: userId, token: accessToken, status: response.status };
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

    return { userId: userId, token: accessToken, status: response.status };
};

// Lets the user choose auth type manually
export const manualAuth = async (
    app: Application,
    endpoint: string,
    data: MANUAL_INPUT_DATA_TYPES,
    token?: string | null
): MANUAL_AUTH_RETURN_TYPES => {
    // Deregister if token sent
    if (token || token === null) {
        if (token === null) {
            const deregisterNoToken = await request(app)
                .post(endpoint)
                .send(data);
            return { status: deregisterNoToken.status };
        }

        const deregisterRes = await request(app)
            .post(endpoint)
            .set("Cookie", [`accessToken=${token}`])
            .send(data);
        return { status: deregisterRes.status };
    }

    // Login or Register if token not sent
    const response = await request(app).post(endpoint).send(data);

    if (response.status === 200) {
        // Incase of Logout
        if (!response.body.id) return { status: 200 };

        const userId = response.body.id;
        const cookies = response.headers["set-cookie"];
        const accessToken = getAccessToken(cookies);

        expect(accessToken).toBeDefined();
        return { userId: userId, token: accessToken, status: 200 };
    }
    return { status: response.status };
};
