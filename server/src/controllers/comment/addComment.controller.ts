import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const addComment = async (req: Request, res: Response) => {
	try {
		const { desc, userId, postId } = req.body;

		const { data, error } = await supabase
			.from("comments")
			.insert({ desc: desc, userId: userId, postId: postId })
			.select();

		if (error) throw Error("Comment upload to DB failed!");

		res.status(200).json(data);
	} catch (error) {
		res.status(401).json(error);
	}
};
