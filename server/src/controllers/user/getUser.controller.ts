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

		if (error) throw Error("User fetch from DB failed!");
		res.status(200).json(data[0]);
	} catch (error) {
		res.status(401).json(error);
	}
};
