import supabase from "$/db/connect";
import { type Request, type Response } from "express";

export const getPosts = async (_req: Request, res: Response) => {
    const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*, users (name, profilePic)");

    if (postsError) {
        res.status(401).send("Unauthorized user!");
        throw postsError;
    }

    const mutatedPosts = posts.map((post) => ({
        createdAt: post.createdAt,
        desc: post.desc,
        id: post.id,
        img: post.img,
        userId: post.userId,
        name: post.users ? post.users.name : null,
        profilePic: post.users ? post.users.profilePic : null,
    }));

    res.status(200).json({ posts: mutatedPosts });
};
