import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const myUserId = req.body.userId;

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
