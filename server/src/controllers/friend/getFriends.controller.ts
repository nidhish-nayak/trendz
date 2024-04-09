import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { type Request, type Response } from "express";

export const getFriends = async (req: Request, res: Response) => {
    const userId = getUserIdFromCookie(req);

    const { data: friendsData, error: friendsError } = await supabase
        .rpc("get_friends_id", { my_user_id: userId })
        .limit(20);

    if (friendsError)
        return res.status(401).json("get_friends_rpc failed in server!");

    const filteredIds = friendsData.map((friend) => friend.frienduserid);

    const { data, error } = await supabase
        .from("users")
        .select("id, username, name, profilePic")
        .in("id", filteredIds);

    if (error)
        return res.status(400).json("get_friends details failed in server!");

    return res.status(200).json(data);
};
