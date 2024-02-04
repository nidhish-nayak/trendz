import { uploadMulter } from "$/config/multer";
import { uploadFile } from "$/controllers/upload/upload.controller";
import express from "express";

const router = express.Router();

router.post("/", uploadMulter.single("file"), uploadFile);

export default router;
