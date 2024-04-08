import { z } from "zod";

export const CommentSchema = z.object({
    body: z.object({
        desc: z.string().min(1),
        userId: z.number(),
        postId: z.number(),
    }),
});
