import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { ActivitySchema } from "$/validations/activity.validation";
import { Request, Response } from "express";

export const postActivity = async (req: Request, res: Response) => {
	const validationResult = ActivitySchema.safeParse(req);
	if (!validationResult.success)
		return res.status(400).json("Input validation failed!");

	const {
		table_name,
		message,
		activity_created_at,
		user_id,
		post_id,
		comment_id,
	} = validationResult.data.body;

	const userId = getUserIdFromCookie(req);
	if (user_id !== userId)
		return res.status(401).json("userId mismatch - unauthorized!");

	const { data, error } = await supabase
		.from("activities")
		.insert([
			{
				table_name: table_name,
				message: message,
				activity_created_at: activity_created_at,
				user_id: user_id,
				post_id: post_id,
				comment_id: comment_id ? comment_id : null,
			},
		])
		.select();

	if (error)
		return res.status(400).json("Insert to activities table failed!");

	return res.status(200).json(data);
};
