import { supabase } from "$/db/connect";
import { LikeSchema } from "$/validations/like.validation";
import { type Request, type Response } from "express";

export const addLike = async (req: Request, res: Response) => {
    const validationResult = LikeSchema.safeParse(req);
    if (!validationResult.success)
        return res.status(400).send("Input validation failed!");

    const { postId, userId } = validationResult.data.body;

    const { data: existingLike, error: existingLikeError } = await supabase
        .from("likes")
        .select("*")
        .eq("postId", postId)
        .eq("userId", userId);

    if (existingLikeError)
        return res.status(400).json("Existing like check failed from DB!");

    if (existingLike.length >= 1) {
        return res.status(401).json("User has already liked the post!");
    } else {
        const { data, error } = await supabase
            .from("likes")
            .insert({ postId: postId, userId: userId })
            .select();

        if (error) res.status(400).json("Adding like to DB failed!");

        return res.status(200).json(data);
    }
};
