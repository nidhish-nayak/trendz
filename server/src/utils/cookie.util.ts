import { Response } from "express";

const clearAllCookies = (res: Response) => {
    return res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
};

export default clearAllCookies;
