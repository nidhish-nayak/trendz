import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { prefix } from "$/utils/prefix.util";
import { StorySchema } from "$/validations/story.validation";
import { type Request, type Response } from "express";

export const postStory = async (req: Request, res: Response) => {
	const validationResult = StorySchema.safeParse(req);
	const userId = getUserIdFromCookie(req);

	if (!validationResult.success) {
		return res.status(401).json("Unauthorized!");
	}

	const { img } = validationResult.data.body;

	if (!img) {
		return res.status(400).json("No image!");
	}

	if (img) {
		if (!img.includes(prefix.prefixStories)) {
			return res.status(401).send("Unauthorized!");
		}
	}

	const { data, error } = await supabase
		.from("stories")
		.insert({ img: img, userId: userId })
		.select();

	if (error) {
		res.status(500).json("Story data upload to DB failed!");
		throw Error("Error inserting story to DB!");
	}
	return res.status(200).json(data);
};
