import config from "$/config/config";
import { type Request, type Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
	if (!req.file) throw new Error("File from multer middleware not sent!");

	try {
		const file = req.file as Express.MulterS3.File;
		if (!file) return res.status(401).send("File not found in server!");
		return res
			.status(200)
			.json(config.s3Config.cloudfrontLink + "/" + file.key);
	} catch (error) {
		return res.status(500).send("File upload failed!");
	}
};
