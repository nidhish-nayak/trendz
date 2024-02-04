import {
	addComment,
	deleteComment,
	getComments,
} from "$/controllers/comment.controller";
import express from "express";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.delete("/:id", deleteComment);

export default router;
