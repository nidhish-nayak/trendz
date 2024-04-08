import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getCommentsCount = async (req: Request, res: Response) => {
    if (!req.query.postId)
        return res.status(400).json("postId in getCound not found!");

    const postIdString = req.query.postId as string;
    const postId = parseInt(postIdString);

    const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("postId", postId);

    if (error)
        return res
            .status(400)
            .json(`Comments fetch failed for postId=${postId}!`);

    return res.status(200).json(count);
};
