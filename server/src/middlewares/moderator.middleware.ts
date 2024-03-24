import config from "$/config/config";
import axios from "axios";
import { NextFunction, Request, Response } from "express";

import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { prefix } from "$/utils/prefix.util";
import { AddPostSchema } from "$/validations/post.validation";
import { StorySchema } from "$/validations/story.validation";

const moderatorMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let validationResult;
	const user_id = getUserIdFromCookie(req);
	validationResult = AddPostSchema.safeParse(req);

	if (!validationResult.success) {
		validationResult = StorySchema.safeParse(req);

		if (!validationResult.success) {
			return res.status(401).json("Unauthorized!");
		}

		const { img } = validationResult.data.body;

		const options = {
			method: "POST",
			url: config.modOptions.modUrl,
			headers: {
				"content-type": "application/json",
				"X-RapidAPI-Key": config.modOptions.modKey,
				"X-RapidAPI-Host": config.modOptions.modHost,
			},
			data: {
				url: img,
			},
		};

		try {
			const response = await axios.request(options);
			if (response.data.unsafe === true) {
				const { data, error } = await supabase
					.from("bans")
					.insert({ user_id: user_id })
					.select();

				if (error) return res.status(400).json("Ban failed!");

				// Clear cookies on ban
				res.clearCookie("accessToken", {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				})
					.status(403)
					.send("You are banned!");
			}
			return next();
		} catch (error) {
			return res.status(400).send("Failed!");
		}
	}

	const { userId, img, filename } = validationResult.data.body;

	if (img) {
		if (!filename) return res.status(401).send("Unauthorized!");
		if (!img.includes(prefix.prefixPosts) || !img.includes(filename)) {
			return res.status(401).send("Unauthorized!");
		}
	}

	if (user_id !== userId) {
		return res.status(401).send("Unauthorized");
	}

	const options = {
		method: "POST",
		url: config.modOptions.modUrl,
		headers: {
			"content-type": "application/json",
			"X-RapidAPI-Key": config.modOptions.modKey,
			"X-RapidAPI-Host": config.modOptions.modHost,
		},
		data: {
			url: img,
		},
	};

	try {
		const response = await axios.request(options);
		if (response.data.unsafe === true) {
			const { data, error } = await supabase
				.from("bans")
				.insert({ user_id: user_id })
				.select();

			if (error) return res.status(400).json("Ban failed!");

			// Clear cookie on ban
			return res
				.clearCookie("accessToken", {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				})
				.status(403)
				.send("You are banned!");
		}
		return next();
	} catch (error) {
		return res.status(400).send("Failed!");
	}
};

export default moderatorMiddleware;
