import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { Request, Response } from "express";

const getFindPeople = async (req: Request, res: Response) => {
    const userId = getUserIdFromCookie(req);

    const { data, error } = await supabase
        .rpc("get_findpeople", {
            my_user_id: userId,
        })
        .limit(15);

    if (error)
        return res.status(400).json("users fetch failed for getFindPeople!");

    return res.status(200).json(data);
};

export default getFindPeople;
