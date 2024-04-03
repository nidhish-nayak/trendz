import { getUser } from "$/controllers/user/getUser.controller";
import { onlineUsers } from "$/controllers/user/supabase/onlineUsers.controller";
import { updateUser } from "$/controllers/user/updateUser.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/find/:userId", authMiddleware, getUser);
router.put("/", authMiddleware, updateUser);

// GET USER ONLINE STATUS ON LOGIN
router.post("/onlineUsers", authMiddleware, onlineUsers);

export default router;
