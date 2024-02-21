import { z } from "zod";

export const ProfileEditSchema = z.object({
	body: z.object({
		id: z.number(),
		name: z.string(),
		email: z.string(),
		username: z.string(),
		city: z.string().optional(),
		website: z.string().optional(),
		profilePic: z.string().optional(),
		coverPic: z.string().optional(),
	}),
});
