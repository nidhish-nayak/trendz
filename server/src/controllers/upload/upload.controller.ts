import { type Request, type Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
	// Get filename from multerUpload middleware
	const file = req.file;

	if (!file) return res.status(401).send("File not found in server!");
	res.status(200).json(file.filename);
};
