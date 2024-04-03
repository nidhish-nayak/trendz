import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getStories = async (req: Request, res: Response) => {
	const userId = getUserIdFromCookie(req);

	const { data, error } = await supabase
		.rpc("get_stories", {
			user_id: userId,
		})
		.order("createdAt", { ascending: false })
		.limit(15);

	if (error)
		return res.status(401).json("Error when fetching stories from DB!");

	return res.status(200).json(data);
};
