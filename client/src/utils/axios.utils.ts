import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "http://localhost:5173/api",
    withCredentials: true,
});
