import { getTest } from "$/controllers/test.controller";
import express from "express";

const router = express.Router();

router.get("/", getTest);

export default router;
