import config from "$/config/config";
import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { AddPostSchema } from "$/validations/post.validation";
import { type Request, type Response } from "express";

export const addPost = async (req: Request, res: Response) => {
	try {
		const user_id = getUserIdFromCookie(req);

		// Zod validations
		const validationResult = AddPostSchema.safeParse(req);
		if (!validationResult.success) {
			return res.status(400).send("Input validation failed!");
		}

		const { desc, img, userId, filename } = validationResult.data.body;

		if (img) {
			if (!filename) return res.status(401).send("Unauthorized!");

			const prefixLink = config.s3Config.cloudfrontLink + "/posts/";
			const prefixFile = filename;

			if (!img.includes(prefixLink) || !img.includes(prefixFile)) {
				return res.status(401).send("Unauthorized!");
			}
		}

		if (user_id !== userId) {
			return res.status(401).send("Unauthorized");
		}

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
