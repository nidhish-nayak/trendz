import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { RelationshipSchema } from "$/validations/relationship.validation";
import { type Request, type Response } from "express";

export const postRelations = async (req: Request, res: Response) => {
    // Zod validations
    const user_id = getUserIdFromCookie(req);
    const validationResult = RelationshipSchema.safeParse(req);
    if (!validationResult.success) {
        return res.status(400).send("Input validation failed!");
    }

    const { followerUserId, followedUserId } = validationResult.data.body;

    if (followerUserId !== user_id) {
        return res.status(401).send("Unauthorized");
    }

    const { data: existingRecord, error: existingError } = await supabase
        .from("relationships")
        .select("*");

    if (existingError)
        return res
            .status(400)
            .json("Follow post failed at checking existing records");

    const checkRecordExist = () => {
        if (!existingRecord || existingRecord.length === 0) {
            return false; // No records exist
        }

        for (const record of existingRecord) {
            if (
                record.followerUserId === followerUserId &&
                record.followedUserId === followedUserId
            ) {
                return true; // Record exists
            }
        }

        return false; // No matching record found
    };

    if (checkRecordExist())
        return res.status(400).json("Follow relationship already exists!");

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
