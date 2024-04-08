import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const user_id = getUserIdFromCookie(req);

        const id = req.params.id;
        const commentId: number = parseInt(id);

        const { data: existingComment, error: existingError } = await supabase
            .from("comments")
            .select("userId")
            .eq("id", commentId);

        if (existingError)
            return res.status(400).json("Error deleting comments");

        if (user_id !== existingComment[0].userId)
            return res.status(401).json("Unauthorized!");

        const { data, error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (error) throw Error("Comment deletion from DB failed!");
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(401).json(error);
    }
};
