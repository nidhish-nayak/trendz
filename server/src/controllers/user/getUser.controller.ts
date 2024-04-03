import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const getUser = async (req: Request, res: Response) => {
	try {
		const id: string = req.params.userId;
		const userId: number = parseInt(id);

		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", userId);

		if (error) return res.status(400).json("User fetch from DB failed!");
		return res.status(200).json(data[0]);
	} catch (error) {
		return res.status(401).json(error);
	}
};
