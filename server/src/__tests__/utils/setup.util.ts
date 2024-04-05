import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { zodMiddleware } from "$/middlewares/zod.middleware";
import config from "$/config/config";

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
