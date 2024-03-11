import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
	try {
		const myUserId: number = getUserIdFromCookie(req);

		// RPC functions for complex JOINS
		const { data: posts, error } = await supabase.rpc("get_user_posts", {
			my_id: myUserId,
		});

		if (error) res.status(400).json("Function get_user_posts() failed!");
		res.status(200).json(posts);
	} catch (error) {
		res.status(401).json(error);
	}
};
