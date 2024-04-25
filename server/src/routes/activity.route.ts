import { getActivities } from "$/controllers/activity/getActivities.controller";
import { postActivity } from "$/controllers/activity/postActivity.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/", authMiddleware, getActivities);
router.post("/", authMiddleware, postActivity);

export default router;
