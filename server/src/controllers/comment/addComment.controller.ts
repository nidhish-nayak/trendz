import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { CommentSchema } from "$/validations/comment.validation";
import { type Request, type Response } from "express";

export const addComment = async (req: Request, res: Response) => {
	try {
		const user_id = getUserIdFromCookie(req);

		const validationResult = CommentSchema.safeParse(req);
		if (!validationResult.success)
			return res.status(400).send("Input validation failed!");

		const { desc, userId, postId } = validationResult.data.body;

		if (user_id !== userId) return res.status(401).send("Unauthorized!");

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
