import express from "express";

import { addComment } from "$/controllers/comment/addComment.controller";
import { deleteComment } from "$/controllers/comment/deleteComment.controller";
import { getComments } from "$/controllers/comment/getComments.controller";
import authMiddleware from "$/middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getComments);
router.post("/", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
