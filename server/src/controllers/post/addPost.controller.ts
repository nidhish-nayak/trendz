import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import moderatorCheck from "$/utils/moderator.util";
import { prefix } from "$/utils/prefix.util";
import { AddPostSchema } from "$/validations/post.validation";
import { type Request, type Response } from "express";

export const addPost = async (req: Request, res: Response) => {
    try {
        const user_id = getUserIdFromCookie(req);

        // Zod validations
        const validationResult = AddPostSchema.safeParse(req);
        if (!validationResult.success) {
            return res.status(401).send("Unauthorized!");
        }

        const { desc, img, userId, filename } = validationResult.data.body;

        if (img) {
            if (!filename) return res.status(401).send("Unauthorized!");
            if (!img.includes(prefix.prefixPosts) || !img.includes(filename)) {
                return res.status(401).send("Unauthorized!");
            }
        }

        if (user_id !== userId) return res.status(401).send("Unauthorized");

        const { data, error } = await supabase
            .from("posts")
            .insert([
                {
                    desc: desc,
                    img: img ? img : null,
                    userId: userId,
                },
            ])
            .select();

        if (error) return res.status(400).json("Post upload to DB has failed!");

        // Call moderator on separate thread
        if (img) {
            setTimeout(() => {
                moderatorCheck(data[0].id, "posts", userId, img);
            }, 1);
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(401).json(error);
    }
};
