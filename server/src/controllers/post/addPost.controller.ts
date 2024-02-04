import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const addPost = async (req: Request, res: Response) => {
	try {
		const { desc, img, userId } = req.body;
		console.log(req);

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

		if (error) throw Error("Post sharing has failed!");

		res.status(200).json(data);
	} catch (error) {
		res.status(401).json(error);
	}
};
