import { addPost } from "$/controllers/post/addPost.controller";
import { deletePost } from "$/controllers/post/deletePost.controller";
import getExplore from "$/controllers/post/getExplore.controller";
import { getPosts } from "$/controllers/post/getPosts.controller";
import { getSinglePosts } from "$/controllers/post/getSinglePost.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import moderatorMiddleware from "$/middlewares/moderator.middleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, moderatorMiddleware, addPost);
router.delete("/:postId", authMiddleware, deletePost);

// Get posts for explore
router.get("/explore", authMiddleware, getExplore);

// Get all individual posts for sharing
router.get("/:postId", getSinglePosts);

export default router;
