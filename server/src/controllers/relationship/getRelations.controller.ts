import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getRelations = async (req: Request, res: Response) => {
	const id: string = req.params.followedUserId;
	const followedUserId: number = parseInt(id);
	const userId = getUserIdFromCookie(req);

	// If user viewing his own profile - send no.of followers
	if (followedUserId === userId) {
		const { data: followedData, error: followedError } = await supabase
			.from("relationships")
			.select("*")
			.eq("followedUserId", userId);

		if (followedError) return res.status(400).json(followedError);
		return res.status(200).json(followedData);
	}

	const { data, error } = await supabase
		.from("relationships")
		.select("*")
		.eq("followerUserId", userId)
		.eq("followedUserId", followedUserId);

	if (error) return res.status(400).json(error);

	return res.status(200).json(data);
};
