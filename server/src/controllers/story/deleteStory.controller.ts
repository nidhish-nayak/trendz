import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const deleteStory = async (req: Request, res: Response) => {
	try {
		const id = req.params.storyId;
		const storyId: number = parseInt(id);

		const { data, error } = await supabase
			.from("stories")
			.delete()
			.eq("id", storyId);

		if (error) throw Error("Story deletion from DB failed!");
		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		res.status(401).json(error);
	}
};
