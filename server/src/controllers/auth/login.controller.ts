import config from "$/config/config";
import supabase from "$/db/connect";
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

        if (existingError) throw existingError;

        if (existingUser.length === 0) {
            return res
                .status(404)
                .send("User is not registered. Please sign up.");
        }

        // Compare passwords
        const hashedPassword = existingUser[0].password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        const userId = existingUser[0].id;
        const { password: string, ...other } = existingUser[0];

        if (isPasswordValid && jwtKey) {
            const token = jwt.sign({ id: userId }, jwtKey);
            return res
                .cookie("accessToken", token, {
                    httpOnly: true,
                    secure: true, // Ensure token is sent only over https
                })
                .status(200)
                .json(other);
        } else {
            return res.status(401).send("Invalid username or password");
        }
    } catch (error) {
        console.error("Error during login!");
        return res.status(500).send("Internal Server Error");
    }
};
