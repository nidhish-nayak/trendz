import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getFollowing = async (req: Request, res: Response) => {
	const userId = getUserIdFromCookie(req);

	const { data: followingData, error: followingError } = await supabase
		.rpc("get_following_id", { my_user_id: userId })
		.limit(20);

	if (followingError)
		return res.status(400).json("RPC function fail in server!");

	const allFollowing = followingData.map(
		(following) => following.followinguserid
	);

	const { data, error } = await supabase
		.from("users")
		.select("id, name, username, profilePic")
		.in("id", allFollowing);

	if (error)
		return res.status(400).json("Following data failed fetch in server!");

	res.status(200).json(data);
};
