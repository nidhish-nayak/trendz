import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getComments = async (req: Request, res: Response) => {
	const postIdString = req.query.postId as string;
	const postId = parseInt(postIdString);

	const { data: comments, error } = await supabase.rpc("get_user_comments", {
		post_id: postId,
	});

	if (error)
		return res
			.status(400)
			.json(`Comments fetch failed for postId=${postId}`);

	return res.status(200).json(comments);
};
