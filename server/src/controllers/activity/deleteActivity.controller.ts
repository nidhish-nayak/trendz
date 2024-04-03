import { supabase } from "$/db/connect";
import { Request, Response } from "express";

// This is not required since we are CASCADING on post & comments removal
export const deleteActivity = async (req: Request, res: Response) => {
	const id = req.params.postId;
	const postId = parseInt(id);

	const { data: existingActivity, error: existingError } = await supabase
		.from("activities")
		.select("*")
		.eq("table_id", postId);

	if (existingError)
		return res.status(400).json("Error while checking existing activity!");

	if (existingActivity.length < 1) {
		return res
			.status(200)
			.json("The activity does not exist in DB, hence nothing deleted!");
	}

	const { data, error } = await supabase
		.from("activities")
		.delete()
		.eq("table_id", postId);

	if (error)
		return res.status(400).json("Insert to activities table failed!");

	return res.status(200).json(data);
};
