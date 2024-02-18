import { supabase } from "$/db/connect";
import { RelationshipSchema } from "$/validations/relationship.validation";
import { type Request, type Response } from "express";

export const postRelations = async (req: Request, res: Response) => {
	// Zod validations
	const validationResult = RelationshipSchema.safeParse(req);
	if (!validationResult.success) {
		return res.status(400).send("Input validation failed!");
	}

	const { followerUserId, followedUserId } = validationResult.data.body;

	const { data, error } = await supabase
		.from("relationships")
		.insert({
			followedUserId: followedUserId,
			followerUserId: followerUserId,
		})
		.select();

	if (error) {
		return res.status(401).send("Inserting relations to DB failed!");
	}

	return res.status(200).json(data);
};
