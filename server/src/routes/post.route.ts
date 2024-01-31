import upload from "$/config/multer";
import { addPost } from "$/controllers/post/addPost.controller";
import { deletePost } from "$/controllers/post/deletePost.controller";
import { getPosts } from "$/controllers/post/getPosts.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, upload.single("file"), addPost);
router.delete("/:id", deletePost);

export default router;
