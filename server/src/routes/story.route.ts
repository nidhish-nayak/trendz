import { deleteStory } from "$/controllers/story/deleteStory.controller";
import { getStories } from "$/controllers/story/getStories.controller";
import { postStory } from "$/controllers/story/postStory.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getStories);
router.post("/", authMiddleware, postStory);
router.delete("/:storyId", authMiddleware, deleteStory);

export default router;
