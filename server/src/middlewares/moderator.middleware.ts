import config from "$/config/config";
import axios from "axios";
import { NextFunction, Request, Response } from "express";

import { addBan, getModerationAxiosConfig } from "$/utils/axios.util";
import clearAllCookies from "$/utils/cookie.util";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { prefix } from "$/utils/prefix.util";
import { AddPostSchema } from "$/validations/post.validation";
import { StorySchema } from "$/validations/story.validation";

const moderatorMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Toggle moderator on/off as per config
	if (config.modOptions.modStatus === false) {
		return next();
	}

	let validationResult;
	const user_id = getUserIdFromCookie(req);
	validationResult = AddPostSchema.safeParse(req);

	if (!validationResult.success) {
		// STORY VALIDATION
		validationResult = StorySchema.safeParse(req);

		if (!validationResult.success) {
			return res.status(401).json("Unauthorized!");
		}

		const { img } = validationResult.data.body;
		const options = getModerationAxiosConfig(img);

		try {
			const response = await axios.request(options);
			if (response.data.unsafe === true) {
				const banAdded = await addBan(user_id);
				if (banAdded === false)
					return res.status(400).json("Ban failed!");

				// Clear cookies on ban
				return clearAllCookies(res).status(403).send("You are banned!");
			}
			return next();
		} catch (error) {
			return res.status(400).send("Failed!");
		}
	}

	// POSTS VALIDATION
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

	if (!img) return next();

	const options = getModerationAxiosConfig(img);

	try {
		const response = await axios.request(options);
		if (response.data.unsafe === true) {
			const banAdded = await addBan(user_id);
			if (banAdded === false) return res.status(400).json("Ban failed!");

			// Clear cookie on ban
			return clearAllCookies(res).status(403).send("You are banned!");
		}
		return next();
	} catch (error) {
		return res.status(400).send("Failed!");
	}
};

export default moderatorMiddleware;
