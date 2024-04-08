import { z } from "zod";

export const OnlineUsersSchema = z.object({
    body: z.array(z.number()),
});
