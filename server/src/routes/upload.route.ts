import { uploadFile } from "$/controllers/upload/upload.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import { uploadMulter } from "$/middlewares/multer.middleware";
import express from "express";

const router = express.Router();

router.post("/", authMiddleware, uploadMulter.single("file"), uploadFile);

export default router;
