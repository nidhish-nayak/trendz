import { supabase } from "$/db/connect";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "$/validations/auth.validation";
import { type Request, type Response } from "express";

export const register = async (req: Request, res: Response) => {
	// Zod validations
	const validationResult = RegisterSchema.safeParse(req);
	if (!validationResult.success) {
		return res.status(400).send("Input validation failed!");
	}

	const { username, name, email, password } = validationResult.data.body;

	// Check if user exists
	const { data: existingUser, error: existingError } = await supabase
		.from("users")
		.select("username")
		.or(`email.eq.${email}, username.eq.${username}`);

	if (existingError) throw existingError;

	if (existingUser.length > 0) {
		return res.status(409).send("User/Email already exists!");
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Insert User
	const { data: insertUser, error: insertError } = await supabase
		.from("users")
		.insert([
			{
				username: username,
				name: name,
				email: email,
				password: hashedPassword,
			},
		])
		.select();

	if (insertError)
		return res.status(500).send("New user registration failed!");

	if (insertUser.length > 0) {
		return res.status(200).send("User added successfully!");
	}
};
