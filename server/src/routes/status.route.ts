import { getStatus } from "$/controllers/status/getStatus.controller";
import express from "express";

const router = express.Router();

router.get("/", getStatus);

export default router;
