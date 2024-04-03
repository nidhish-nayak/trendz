import getFindPeople from "$/controllers/friend/getFindPeople.controller";
import { getFollowers } from "$/controllers/friend/getFollowers.controller";
import { getFollowing } from "$/controllers/friend/getFollowing.controller";
import { getFriends } from "$/controllers/friend/getFriends.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, getFriends);
router.get("/followers", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);
router.get("/findPeople", authMiddleware, getFindPeople);

export default router;
