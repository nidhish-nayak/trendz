import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";

import config from "./config/config";
import { zodMiddleware } from "./middlewares/zod.middleware";

import activityRoutes from "./routes/activity.route";
import authRoutes from "./routes/auth.route";
import commentRoutes from "./routes/comment.route";
import friendRoutes from "./routes/friend.route";
import likeRoutes from "./routes/like.route";
import postRoutes from "./routes/post.route";
import relationshipRoutes from "./routes/relationship.route";
import statusRoutes from "./routes/status.route";
import storyRoutes from "./routes/story.route";
import uploadRoutes from "./routes/upload.route";
import userRoutes from "./routes/user.route";

const app: Application = express();

// Configs
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.corsOptions));
app.use(cookieParser());

// Global catches using zod
app.use(zodMiddleware);

// Upload to client API
app.use("/api/upload", uploadRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/activities", activityRoutes);

// Test if server is running or not
app.use("/api/test", statusRoutes);

// Listener
app.listen(config.port, () => {
	console.log(
		"Server is running on port: " + `http://localhost:${config.port}`
	);
});
