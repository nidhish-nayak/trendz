import { login } from "$/controllers/auth/login.controller";
import { logout } from "$/controllers/auth/logout.controller";
import { register } from "$/controllers/auth/register.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
