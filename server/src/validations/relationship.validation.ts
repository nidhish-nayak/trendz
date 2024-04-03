import { z } from "zod";

export const RelationshipSchema = z.object({
	body: z.object({
		followerUserId: z.number(),
		followedUserId: z.number(),
	}),
});
