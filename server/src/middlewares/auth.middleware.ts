import config from "$/config/config";
import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id = getUserIdFromCookie(req);
	const token = req.cookies.accessToken;
	const key = config.jwtKey;

	if (!token) return res.status(401).send("Not logged in!");
	if (!key) return res.status(404).send("Server error - JWT key not found!");

	try {
		const { data, error } = await supabase
			.from("bans")
			.select("*")
			.eq("user_id", user_id);

		if (error) return res.status(400).send("Auth check failed!");

		if (data.length >= 1) {
			res.clearCookie("accessToken", {
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
				.status(200)
				.send("You are banned!");
			return res.status(401).send("You are banned!");
		}

		const verified = jwt.verify(token, key);
		if (!verified) return res.status(403).send("Token is not valid!");

		next();
	} catch (err) {
		return res.status(403).send("Token verification failed!");
	}
};

export default authMiddleware;
