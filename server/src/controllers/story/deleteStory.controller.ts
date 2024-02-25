import { type Request, type Response } from "express";

export const deleteStory = (_req: Request, res: Response) => {
	res.status(200).send("Server is running!");
};
