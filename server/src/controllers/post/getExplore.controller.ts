import { supabase } from "$/db/connect";
import { Request, Response } from "express";

const getExplore = async (_req: Request, res: Response) => {
	// set a limit to number of posts needed
	const limit = 18;

	const { data, error } = await supabase.rpc("get_explore_posts", {
		limit_no: limit,
	});

	if (error)
		return res.status(400).json("Explore posts fetch failed from DB!");
	return res.status(200).json(data);
};

export default getExplore;
