import { Response } from "express";

const clearAllCookies = (res: Response) => {
    try {
        return res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    } catch (error) {
        return console.log("Cookie clear failed!");
    }
};

export default clearAllCookies;
