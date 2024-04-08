import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string)
        : 10;

    const myUserId: number = getUserIdFromCookie(req);

    // RPC functions for complex JOINS
    const { data: posts, error } = await supabase.rpc("get_user_posts", {
        my_id: myUserId,
        page: page,
        page_size: pageSize,
    });

    if (error) res.status(400).json("Function get_user_posts() failed!");
    res.status(200).json(posts);
};
