import { supabase } from "$/db/connect";
import { AddPostSchema } from "$/validations/post.validation";
import { type Request, type Response } from "express";

export const addPost = async (req: Request, res: Response) => {
	try {
		// Zod validations
		const validationResult = AddPostSchema.safeParse(req);
		if (!validationResult.success) {
			return res.status(400).send("Input validation failed!");
		}

		const { desc, img, userId } = validationResult.data.body;

		const { data, error } = await supabase
			.from("posts")
			.insert([
				{
					desc: desc,
					img: img ? img : null,
					userId: userId,
				},
			])
			.select();

		if (error) res.status(400).json("Post upload to DB has failed!");

		res.status(200).json(data);
	} catch (error) {
		res.status(401).json(error);
	}
};
