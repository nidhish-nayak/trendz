import { deleteRelations } from "$/controllers/relationship/deleteRelations.controller";
import { getRelations } from "$/controllers/relationship/getRelations.controller";
import { postRelations } from "$/controllers/relationship/postRelations.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/:followedUserId", authMiddleware, getRelations);
router.post("/", authMiddleware, postRelations);
router.delete("/:followedUserId", authMiddleware, deleteRelations);

export default router;
