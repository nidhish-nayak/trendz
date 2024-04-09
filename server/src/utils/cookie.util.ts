import { Response } from "express";

const clearAllCookies = (res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
};

export default clearAllCookies;
