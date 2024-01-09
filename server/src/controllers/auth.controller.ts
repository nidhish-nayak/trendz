import config from "$/config/config";
import { executeQuery } from "$/db/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { LoginSchema, RegisterSchema } from "$/validations/auth.validation";
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
        const existingUser = await executeQuery(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        if (existingUser.length > 0) {
            return res.status(409).send("User already exists!");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const insertUserQuery =
            "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?)";

        const userValues = [username, email, hashedPassword, name];
        const insertionResult = await executeQuery(insertUserQuery, [
            userValues,
        ]);

        if (insertionResult) {
            return res.status(201).send("User added successfully!");
        }

        return res.status(500).send("New user registration failed!");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error!");
    }
};

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
        const [existingUser] = await executeQuery(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (!existingUser) {
            return res
                .status(404)
                .send("User is not registered. Please sign up.");
        }

        // Compare passwords
        const hashedPassword = existingUser.password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        const userId = existingUser.id;
        const { password: string, ...other } = existingUser;

        if (isPasswordValid && jwtKey) {
            const token = jwt.sign({ id: userId }, jwtKey);
            return res
                .cookie("accessToken", token, {
                    httpOnly: true,
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

export const logout = (_req: Request, _res: Response) => {};
