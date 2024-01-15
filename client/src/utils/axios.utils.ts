import axios from "axios";
import config from "../config/config";

export const makeRequest = axios.create({
    baseURL: `${config.serverUrl}/api`,
    withCredentials: true,
});
