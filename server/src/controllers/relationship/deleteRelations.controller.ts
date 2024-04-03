import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const deleteRelations = async (req: Request, res: Response) => {
	const id: string = req.params.followedUserId;
	const followedUserId: number = parseInt(id);
	const followerUserId: number = getUserIdFromCookie(req);

	const { data, error } = await supabase
		.from("relationships")
		.delete()
		.eq("followedUserId", followedUserId)
		.eq("followerUserId", followerUserId);

	if (error) {
		return res.status(401).send("Relation delete from DB failed!");
	}
	return res.status(200).json(data);
};
