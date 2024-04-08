import { supabase } from "$/db/connect";
import { getUserIdFromCookie } from "$/utils/getUserId.util";
import { Request, Response } from "express";

export const getActivities = async (req: Request, res: Response) => {
    const userId = getUserIdFromCookie(req);
    // set limit for the no.of rows fetched
    const limit = 4;

    const { data, error } = await supabase.rpc("get_activities", {
        my_user_id: userId,
        activity_limit: limit,
    });

    if (error)
        return res.status(400).json("get_activities rpc function failed!");
    return res.status(200).json(data);
};
