import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getFollowers = async (req: Request, res: Response) => {
    const userId = getUserIdFromCookie(req);

    const { data: followerIdData, error: followerIdError } = await supabase
        .rpc("get_followers_id", { my_user_id: userId })
        .limit(20);

    if (followerIdError)
        return res.status(400).json("FollowersID fetch rpc failed!");

    const allFollowers = followerIdData.map(
        (follower) => follower.followeruserid
    );

    const { data, error } = await supabase
        .from("users")
        .select("id, username, name, profilePic")
        .in("id", allFollowers);

    if (error)
        return res.status(400).json("Followers detail fetch failed in server!");

    return res.status(200).json(data);
};
