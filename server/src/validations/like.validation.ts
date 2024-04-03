import { z } from "zod";

export const LikeSchema = z.object({
	body: z.object({
		postId: z.number(),
		userId: z.number(),
	}),
});
