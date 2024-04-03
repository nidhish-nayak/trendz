import { z } from "zod";

export const ProfileEditSchema = z.object({
	body: z.object({
		id: z.number(),
		name: z.string(),
		email: z.string(),
		username: z.string(),
		city: z.string().optional().nullable(),
		website: z.string().optional().nullable(),
		profilePic: z.string().optional(),
		coverPic: z.string().optional(),
	}),
});
