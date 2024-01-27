import config from "$/config/config";
import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.accessToken;
        const key = config.jwtKey;

        const verified: any = jwt.verify(token, key);
        const myUserId = verified?.id;

        // RPC functions for complex JOINS
        const { data: posts, error } = await supabase.rpc("get_user_posts", {
            my_id: myUserId,
        });

        if (error)
            throw Error(
                "Posts data fetching failed from function get_user_posts(my_id)"
            );

        res.status(200).json(posts);
    } catch (error) {
        res.status(401).json(error);
    }
};
