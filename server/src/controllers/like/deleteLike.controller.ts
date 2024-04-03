import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const deleteLike = async (req: Request, res: Response) => {
	const userId: number = getUserIdFromCookie(req);

	const id = req.params.id;
	const postId: number = parseInt(id);

	const { data: existingLike, error: existingLikeError } = await supabase
		.from("likes")
		.select("*")
		.eq("postId", postId)
		.eq("userId", userId);

	if (existingLikeError) throw Error("Error");

	if (existingLike.length === 1) {
		const { data, error } = await supabase
			.from("likes")
			.delete()
			.eq("postId", postId)
			.eq("userId", userId);

		if (error) return res.status(400).json("Deleting like from DB failed!");

		return res.status(200).json(data);
	} else {
		return res.status(401).json("User has not yet liked the post!");
	}
};
