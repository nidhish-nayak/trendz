import { z } from "zod";

export const ProfileEditSchema = z.object({
	body: z.object({
		city: z.string(),
		email: z.string(),
		id: z.number(),
		name: z.string(),
		username: z.string(),
		website: z.string(),
	}),
});
