import config from "$/config/config";
import { type Request, type Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
    if (!req.file)
        return res.status(400).send("File from multer middleware not sent!");

    try {
        const file = req.file as Express.MulterS3.File;
        if (!file) return res.status(401).send("File not found in server!");

        const link = config.s3Config.cloudfrontLink + "/" + file.key;
        return res.status(200).json(link);
    } catch (error) {
        return res.status(500).send("File upload failed!");
    }
};
