import { deleteActivity } from "$/controllers/activity/deleteActivity.controller";
import { getActivities } from "$/controllers/activity/getActivities.controller";
import { postActivity } from "$/controllers/activity/postActivity.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/", authMiddleware, getActivities);
router.post("/", authMiddleware, postActivity);
router.delete("/:postId", authMiddleware, deleteActivity);

export default router;
