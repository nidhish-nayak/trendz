import { supabase } from "$/db/connect";
import { Request, Response } from "express";

export const deleteActivity = async (req: Request, res: Response) => {
	const id = req.params.postId;
	const postId = parseInt(id);

	const { data, error } = await supabase
		.from("activities")
		.delete()
		.eq("table_id", postId);

	if (error)
		return res.status(400).json("Insert to activities table failed!");

	return res.status(200).json(data);
};
