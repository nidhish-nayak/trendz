import { deregister } from "$/controllers/auth/deregister.controller";
import { login } from "$/controllers/auth/login.controller";
import { logout } from "$/controllers/auth/logout.controller";
import { register } from "$/controllers/auth/register.controller";
import getStatus from "$/controllers/auth/status.controller";
import authMiddleware from "$/middlewares/auth.middleware";
import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/status", getStatus);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/deregister", authMiddleware, deregister);

export default router;
