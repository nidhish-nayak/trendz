const cors = require("cors");
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { type Application } from "express";
import config from "./config/config";
import { zodMiddleware } from "./middlewares/zod.middleware";
import authRoutes from "./routes/auth.route";
import commentRoutes from "./routes/comment.route";
import likeRoutes from "./routes/like.route";
import postRoutes from "./routes/post.route";
import userRoutes from "./routes/user.route";

const app: Application = express();

// Configs
dotenv.config();
app.use(express.json());
app.use(cors(config.corsOptions));
app.use(cookieParser());

// Global catches using zod
app.use(zodMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/test", (_req, res) => {
    res.status(200).send("Server is running!");
});

// Listener
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running on port: " + `http://localhost:${PORT}`);
});
