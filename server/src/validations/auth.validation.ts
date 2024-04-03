import { z } from "zod";

export const RegisterSchema = z.object({
	body: z.object({
		username: z.string(),
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(4),
	}),
});

export const LoginSchema = z.object({
	body: z.object({
		username: z.string(),
		password: z.string().min(4),
	}),
});
