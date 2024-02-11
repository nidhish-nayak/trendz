import { addLike } from "$/controllers/like/addLike.controller";
import { deleteLike } from "$/controllers/like/deleteLike.controller";
import { getLikes } from "$/controllers/like/getLikes.controller";

import express from "express";

const router = express.Router();

router.get("/", getLikes);
router.post("/", addLike);
router.delete("/", deleteLike);

export default router;
