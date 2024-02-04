import config from "$/config/config";
import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

type JWT_PAYLOAD_TYPE = {
	id: number;
	iat: number;
};

export const getPosts = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.accessToken;
		const key = config.jwtKey;

		if (!token || !key) throw Error("getPosts failed - no token / key!");

		const verified = jwt.verify(token, key) as JWT_PAYLOAD_TYPE;
		const myUserId = verified.id;

		// RPC functions for complex JOINS
		const { data: posts, error } = await supabase.rpc("get_user_posts", {
			my_id: myUserId,
		});

		if (error) throw Error("Function get_user_posts() failed!");

		res.status(200).json(posts);
	} catch (error) {
		res.status(401).json(error);
	}
};
