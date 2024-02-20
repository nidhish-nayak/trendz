import { getUser } from "$/controllers/user/getUser.controller";
import { updateUser } from "$/controllers/user/updateUser.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/find/:userId", authMiddleware, getUser);
router.put("/", authMiddleware, updateUser);

export default router;
