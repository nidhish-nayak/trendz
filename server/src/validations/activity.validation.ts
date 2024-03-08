import { z } from "zod";

export const ActivitySchema = z.object({
	body: z.object({
		table_name: z.string(),
		table_id: z.number(),
		message: z.string(),
		activity_created_at: z.string(),
		user_id: z.number(),
	}),
});
