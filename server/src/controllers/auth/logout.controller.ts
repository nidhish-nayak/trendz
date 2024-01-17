import { type Request, type Response } from "express";

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
    })
        .status(200)
        .send("User has been logged out.");
};
