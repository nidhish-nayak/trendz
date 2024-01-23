import { sql } from "$/db/connect";
import { type Request, type Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const myUserId = req.body.userId;
        const posts = await sql`
                SELECT p.*, u.id AS "userId", name, "profilePic"
                FROM posts AS p 
                JOIN users AS u 
                ON (u.id = p."userId")
                LEFT JOIN relationships AS r 
                ON (p."userId" = r."followedUserId")
                WHERE r."followerUserId" = ${myUserId} OR p."userId" = ${myUserId};
            `;

        res.status(200).json(posts);
    } catch (error) {
        res.status(401).json(error);
    }
};
