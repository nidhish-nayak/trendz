import { supabase } from "$/db/connect";
import { Request, Response } from "express";
import { getUserIdFromCookie } from "./getUserId.util";

const allowGuestUser = async (req: Request, res: Response) => {
    const user_id = getUserIdFromCookie(req);

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user_id);

    if (error) return res.status(400).json("Guest check from DB failed!");

    // Get guest username
    const { username } = data[0];
    if (username === "guest") {
        // If request is not GET then return 401
        if (
            req.method === "POST" &&
            req.originalUrl === "/api/users/onlineUsers"
        ) {
            return true;
        }
        if (req.method !== "GET") {
            return false;
        }
        return true;
    }
    return true;
};

export default allowGuestUser;
