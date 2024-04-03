import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { OnlineUsersSchema } from "$/validations/online.validation";
import { type Request, type Response } from "express";

export const onlineUsers = async (req: Request, res: Response) => {
	const userId = getUserIdFromCookie(req);
	const validationResult = OnlineUsersSchema.safeParse(req);

	if (!validationResult.success) {
		return res.status(400).json("Input validation failed!");
	}

	const array = validationResult.data.body;

	if (array.length === 1) {
		const { data, error } = await supabase
			.from("users")
			.select("id, username, name, profilePic")
			.in("id", [userId])
			.order("id", { ascending: true });

		if (error)
			return res
				.status(400)
				.json("get_friends details failed in server!");

		return res.status(200).json(data);
	}

	const { data: friendsData, error: friendsError } = await supabase.rpc(
		"get_friends_id",
		{ my_user_id: userId }
	);

	if (friendsError)
		return res.status(401).json("get_friends_rpc failed in server!");

	const friendsArrayIds = friendsData.map((friend) => friend.frienduserid);
	const filteredIds = friendsArrayIds.filter((friend) =>
		array.includes(friend)
	);

	const { data, error } = await supabase
		.from("users")
		.select("id, username, name, profilePic")
		.in("id", [userId, ...filteredIds])
		.order("id", { ascending: true });

	if (error)
		return res.status(400).json("get_friends details failed in server!");

	return res.status(200).json(data);
};
