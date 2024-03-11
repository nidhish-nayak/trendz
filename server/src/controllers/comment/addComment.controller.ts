import { supabase } from "$/db/connect";
import { CommentSchema } from "$/validations/comment.validation";
import { type Request, type Response } from "express";

export const addComment = async (req: Request, res: Response) => {
	try {
		const validationResult = CommentSchema.safeParse(req);
		if (!validationResult.success)
			return res.status(400).send("Input validation failed!");

		const { desc, userId, postId } = validationResult.data.body;

		const { data, error } = await supabase
			.from("comments")
			.insert({ desc: desc, userId: userId, postId: postId })
			.select();

		if (error) return res.status(400).json("Comment insert to DB failed!");

		res.status(200).json(data);
	} catch (error) {
		res.status(401).json(error);
	}
};
