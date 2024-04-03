import { Request } from "express";
import jwt from "jsonwebtoken";

import config from "$/config/config";

type JWT_PAYLOAD_TYPE = {
	id: number;
	iat: number;
};

export const getUserIdFromCookie = (req: Request): number => {
	const token = req.cookies.accessToken;
	const key = config.jwtKey;

	if (!token || !key) return 0;

	const verified = jwt.verify(token, key) as JWT_PAYLOAD_TYPE;
	const myUserId = verified.id;

	return myUserId;
};
