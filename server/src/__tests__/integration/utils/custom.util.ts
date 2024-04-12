import { Application } from "express";
import request from "supertest";

export const customGet = async (
    app: Application,
    endpoint: string,
    token?: string
) => {
    if (token) {
        const response = await request(app)
            .get(endpoint)
            .set("Cookie", [`accessToken=${token}`]);
        return response;
    } else {
        const response = await request(app).get(endpoint);
        return response;
    }
};
