import { z } from "zod";

export const StorySchema = z.object({
	body: z.object({
		img: z.string(),
	}),
});
