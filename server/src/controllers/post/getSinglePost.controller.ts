import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getSinglePosts = async (req: Request, res: Response) => {
    try {
        const postIdString: string = req.params.postId;
        const postId = parseInt(postIdString);

        // RPC functions for complex JOINS
        const { data: posts, error } = await supabase.rpc("get_single_post", {
            my_post_id: postId,
        });

        if (error) res.status(400).json("getSinglePosts fetch failed!");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(400).json(error);
    }
};
