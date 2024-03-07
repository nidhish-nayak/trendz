import express from "express";

import { addComment } from "$/controllers/comment/addComment.controller";
import { deleteComment } from "$/controllers/comment/deleteComment.controller";
import { getComments } from "$/controllers/comment/getComments.controller";
import { getCommentsCount } from "$/controllers/comment/getCount.controller";
import authMiddleware from "$/middlewares/auth.middleware";

const router = express.Router();

router.get("/", getComments);
router.post("/", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deleteComment);

router.get("/count", getCommentsCount);

export default router;
