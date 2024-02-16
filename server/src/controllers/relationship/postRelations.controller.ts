import { type Request, type Response } from "express";

export const postRelations = (req: Request, res: Response) => {
	res.status(200).send("Server is running!");
};
