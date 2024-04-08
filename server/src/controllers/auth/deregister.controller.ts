import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { LoginSchema } from "$/validations/auth.validation";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const deregister = async (req: Request, res: Response) => {
    if (!req.cookies) return res.status(401).json("Cookie not found!");

    const userId = getUserIdFromCookie(req);

    // Zod validations
    const validationResult = LoginSchema.safeParse(req);
    if (!validationResult.success) {
        return res.status(400).json("Input validation failed!");
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
        return res.status(404).json("User is not registered. Unauthorized!");
    }

    // Compare passwords
    const hashedPassword = existingUser[0].password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (userId !== existingUser[0].id)
        return res
            .status(401)
            .json("You are not authorized to delete other's account!");

    if (!isPasswordValid)
        return res.status(401).json("Wrong password, Unauthorized!");

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) return res.status(400).json("Account deletion failed!");

    return res.status(200).json("User account deletion successful!");
};
