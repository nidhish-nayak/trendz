import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getLikes = async (req: Request, res: Response) => {
	if (!req.query.postId || !req.query.userId) {
		return res
			.status(400)
			.json("postIdString/userIdString not received in getLikes!");
	}
	const postIdString = req.query.postId as string;
	const userIdString = req.query.userId as string;

	const postId: number = parseInt(postIdString);
	const userId: number = parseInt(userIdString);

	const { data, error } = await supabase.rpc("get_post_likes", {
		post_id: postId,
		user_id: userId,
	});

	if (error) return res.status(400).json("Likes fetch failed from DB!");

	const likesData = data[0];
	return res.status(200).json(likesData);
};
