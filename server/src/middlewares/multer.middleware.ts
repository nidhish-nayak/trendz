import config from "$/config/config";
import s3 from "$/utils/s3.util";
import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";

if (!config.s3Config.bucketLink)
    throw new Error("AWS S3 bucket link not found!");

// Define custom file size limit middleware
const fileSizeLimit = 1024 * 1024; // 1MB in bytes

export const uploadMulter = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3Config.bucketLink,
        acl: "private",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req: Request, file, cb) {
            cb(
                null,
                `${req.body.folder}/` +
                    Date.now().toString() +
                    file.originalname
            );
        },
    }),
    limits: {
        fileSize: fileSizeLimit,
    },
});
