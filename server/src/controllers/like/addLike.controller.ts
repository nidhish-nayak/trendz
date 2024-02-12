import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const addLike = async (req: Request, res: Response) => {
	const { postId, userId } = req.body;

	const { data: existingLike, error: existingLikeError } = await supabase
		.from("likes")
		.select("*")
		.eq("postId", postId)
		.eq("userId", userId);

	if (existingLikeError) throw Error("Error");

	if (existingLike.length >= 1) {
		return res.status(401).json("User has already liked the post!");
	} else {
		const { data, error } = await supabase
			.from("likes")
			.insert({ postId: postId, userId: userId })
			.select();

		if (error) throw Error("Adding like to DB failed!");
		return res.status(200).json(data);
	}
};
