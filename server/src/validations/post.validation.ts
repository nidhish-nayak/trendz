import { z } from "zod";

export const AddPostSchema = z.object({
	body: z.object({
		desc: z.string(),
		img: z.instanceof(File).optional(),
		userId: z.number(),
	}),
});
