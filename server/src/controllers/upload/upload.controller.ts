import config from "$/config/config";
import { type Request, type Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
	// Get filename from multerUpload middleware
	if (!req.file)
		throw new Error("No file from multer middleware to upload controller!");

	const file = req.file as Express.MulterS3.File;

	if (!file) return res.status(401).send("File not found in server!");
	res.status(200).json(config.s3Config.imageLink + "/" + file.key);
};
