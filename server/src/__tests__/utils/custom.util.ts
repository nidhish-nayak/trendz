import request from "supertest";
import { Application } from "express";

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
