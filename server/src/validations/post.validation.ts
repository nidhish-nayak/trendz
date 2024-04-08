import { z } from "zod";

export const AddPostSchema = z.object({
    body: z.object({
        desc: z.string().min(1),
        img: z.string().optional().or(z.null()),
        userId: z.number(),
        filename: z.string().optional().or(z.null()),
    }),
});
