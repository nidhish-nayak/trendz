import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const deleteStory = async (req: Request, res: Response) => {
	try {
		const user_id = getUserIdFromCookie(req);
		const id = req.params.storyId;
		const storyId: number = parseInt(id);

		const { data: existingStory, error: existingError } = await supabase
			.from("stories")
			.select("userId")
			.eq("userId", user_id)
			.eq("id", storyId);

		if (existingError)
			return res.status(400).json("Failed story deletion!");

		if (existingStory[0].userId < 1) {
			return res.status(401).json("Unauthorized!");
		}

		const { data, error } = await supabase
			.from("stories")
			.delete()
			.eq("id", storyId);

		if (error)
			return res.status(400).json("Story deletion from DB failed!");

		return res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return res.status(401).json(error);
	}
};
