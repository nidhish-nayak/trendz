import axios from "axios";

export const makeRequest = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? `${process.env.SERVER_URL}/api`
            : "http://localhost:3000/api",
    withCredentials: true,
});
