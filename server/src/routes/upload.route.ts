import { uploadFile } from "$/controllers/upload/upload.controller";
import { uploadMulter } from "$/middlewares/multer.middleware";
import express from "express";

const router = express.Router();

router.post("/", uploadMulter.single("file"), uploadFile);

export default router;
