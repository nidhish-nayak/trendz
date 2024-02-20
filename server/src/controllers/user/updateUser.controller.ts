import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { ProfileEditSchema } from "$/validations/user.validation";
import { type Request, type Response } from "express";

export const updateUser = async (req: Request, res: Response) => {
	const validationResult = ProfileEditSchema.safeParse(req);
	if (!validationResult.success) {
		return res.status(400).json("Input validation failed!");
	}

	const formData = validationResult.data.body;
	const userId = getUserIdFromCookie(req);

	const { id, name, username, email, website, city } = formData;

	if (id !== userId) {
		return res.status(401).json("Profile edit not authorized!");
	}

	const { data: existingUser, error: existingUserError } = await supabase
		.from("users")
		.select("*")
		.eq("username", username)
		.neq("id", userId);

	if (existingUserError) throw Error("Error during username check!");

	if (existingUser.length > 0) {
		return res.status(409).json("Username already exists!");
	}

	const { data, error } = await supabase
		.from("users")
		.update({
			name: name,
			username: username,
			email: email,
			website: website,
			city: city,
		})
		.match({ id: id });

	if (error) throw Error("User profile update failed to DB!");

	return res.status(200).json(data);
};
