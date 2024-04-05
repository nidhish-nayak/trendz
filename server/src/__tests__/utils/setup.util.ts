import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";

import config from "$/config/config";
import { zodMiddleware } from "$/middlewares/zod.middleware";

// INITIAL SETUP

export const createApp = (): Application => {
	const app: Application = express();

	dotenv.config();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors(config.corsOptions));
	app.use(cookieParser());
	app.use(zodMiddleware);

	return app;
};
