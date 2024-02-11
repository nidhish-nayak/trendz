import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getLikes = async (req: Request, res: Response) => {
	const postId: number = parseInt(req.query.postId as string);
	const userId: number = parseInt(req.query.userId as string);

	const { data, error } = await supabase.rpc("get_post_likes", {
		post_id: postId,
		user_id: userId,
	});

	if (error) throw new Error("Post likes fetch from DB failed!");

	const likesData = data[0];
	res.status(200).json(likesData);
};
