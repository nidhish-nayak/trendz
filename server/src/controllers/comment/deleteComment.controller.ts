import { supabase } from "$/db/connect";
import { type Request, type Response } from "express";

export const deleteComment = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const commentId: number = parseInt(id);

		const { data, error } = await supabase
			.from("comments")
			.delete()
			.eq("id", commentId);

		if (error) throw Error("Comment deletion from DB failed!");
		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		res.status(401).json(error);
	}
};
