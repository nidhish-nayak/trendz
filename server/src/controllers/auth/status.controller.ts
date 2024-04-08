import { checkTokenExpiration } from "$/utils/token.util";
import { Request, Response } from "express";

const getStatus = async (req: Request, res: Response) => {
    try {
        const token: string | undefined = req.cookies.accessToken;

        if (!token)
            return res.status(200).json({
                token: false,
                expired: false,
                message: "User token not found",
            });

        // Check if token is expired (assuming you have a function to do this)
        const isTokenExpired = checkTokenExpiration(token);

        if (isTokenExpired) {
            return res.status(200).json({
                token: true,
                expired: true,
                message: "User token expired",
            });
        }

        // Token is valid
        return res.status(200).json({
            token: true,
            expired: false,
            message: "User token is valid",
        });
    } catch (error) {
        return res.status(500).json("Server error!");
    }
};

export default getStatus;
