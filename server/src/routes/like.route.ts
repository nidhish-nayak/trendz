import { addLike } from "$/controllers/like/addLike.controller";
import { deleteLike } from "$/controllers/like/deleteLike.controller";
import { getLikes } from "$/controllers/like/getLikes.controller";
import authMiddleware from "$/middlewares/auth.middleware";

import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getLikes);
router.post("/", authMiddleware, addLike);
router.delete("/:id", authMiddleware, deleteLike);

export default router;
