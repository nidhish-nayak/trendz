import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const deletePost = async (req: Request, res: Response) => {
	const userId = getUserIdFromCookie(req);

	const param = req.params.postId;
	const postId: number = parseInt(param);

	const { data: existingPost, error: existingError } = await supabase
		.from("posts")
		.select("*")
		.eq("id", postId)
		.eq("userId", userId);

	if (existingError)
		return res.status(400).json("Error checking existing posts!");

	if (existingPost.length < 1) return res.status(400).json("Post not found!");

	const { data, error } = await supabase
		.from("posts")
		.delete()
		.eq("id", postId)
		.eq("userId", userId);

	if (error) return res.status(401).json("Error during post delete from DB!");
	return res.status(200).json(data);
};
