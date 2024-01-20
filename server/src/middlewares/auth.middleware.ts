import config from "$/config/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    const key = config.jwtKey;

    if (!token) return res.status(401).send("Not logged in!");
    if (!key) return res.status(401).send("Server error - JWT key not found!");

    try {
        const verified = jwt.verify(token, key);
        if (!verified) return res.status(403).send("Token is not valid!");

        next();
    } catch (err) {
        return res.status(403).send("Token verification failed!");
    }
};

export default authMiddleware;
