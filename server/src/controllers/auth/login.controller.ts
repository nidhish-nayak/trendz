import config from "$/config/config";
import { supabase } from "$/db/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { LoginSchema } from "$/validations/auth.validation";
import { type Request, type Response } from "express";

export const login = async (req: Request, res: Response) => {
	try {
		const { jwtKey } = config;

		// Zod validations
		const validationResult = LoginSchema.safeParse(req);
		if (!validationResult.success) {
			return res.status(400).send("Input validation failed!");
		}
		const { username, password } = validationResult.data.body;

		// Check if the user exists
		const { data: existingUser, error: existingError } = await supabase
			.from("users")
			.select("*")
			.eq("username", username);

		if (existingError)
			return res.status(500).json("Error when checking existing user!");

		if (existingUser.length === 0) {
			return res
				.status(404)
				.send("User is not registered. Please sign up.");
		}

		const { data: banCheck, error: banError } = await supabase
			.from("bans")
			.select("*")
			.eq("user_id", existingUser[0].id);

		if (banError) return res.status(400).send("Failed banCheck!");
		if (banCheck.length >= 1) {
			return res.status(401).send("You are banned!");
		}

		// Compare passwords
		const hashedPassword = existingUser[0].password;
		const isPasswordValid = await bcrypt.compare(password, hashedPassword);
		const userId = existingUser[0].id;
		const { password: removedPassword, ...other } = existingUser[0];

		if (isPasswordValid && jwtKey) {
			const token = jwt.sign({ id: userId }, jwtKey);
			return res
				.cookie("accessToken", token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					// set 1 day token expiry
					// maxAge: 24 * 60 * 60 * 1000,
					maxAge: config.token.maxAge,
				})
				.status(200)
				.json(other);
		} else {
			return res.status(401).send("Incorrect password!");
		}
	} catch (error) {
		console.error("Error during login!");
		return res.status(500).send("Internal Server Error");
	}
};
