import { supabase } from "$/db/connect";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "$/validations/auth.validation";
import { type Request, type Response } from "express";

export const register = async (req: Request, res: Response) => {
    try {
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
            .eq("username", username);

        if (existingError) throw existingError;

        if (existingUser.length > 0) {
            return res.status(409).send("User already exists!");
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

        if (insertError) throw insertError;

        if (insertUser.length > 0) {
            return res.status(201).send("User added successfully!");
        }

        return res.status(500).send("New user registration failed!");
    } catch (error) {
        return res.status(500).send("Server error!");
    }
};
