import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getCommentsCount = async (req: Request, res: Response) => {
	const postIdString = req.query.postId as string;
	const postId = parseInt(postIdString);

	const { count, error } = await supabase
		.from("comments")
		.select("*", { count: "exact", head: true })
		.eq("postId", postId);

	if (error) throw Error(`Comments fetch failed for postId=${postId}!`);
	res.status(200).json(count);
};
