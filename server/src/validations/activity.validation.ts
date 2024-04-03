import { z } from "zod";

export const ActivitySchema = z.object({
	body: z.object({
		table_name: z.string(),
		message: z.string(),
		activity_created_at: z.string(),
		user_id: z.number(),
		post_id: z.number(),
		comment_id: z.number().optional(),
	}),
});
