import config from "$/config/config";
import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = (token: string): boolean => {
    const convertUnixTimestampToDate = (unixTimestamp: number): string => {
        const milliseconds = unixTimestamp * 1000;
        const date = new Date(milliseconds + config.token.maxAge);
        const formattedDate = date.toISOString(); // Or use other formatting options as needed
        return formattedDate;
    };

    const decoded = jwtDecode(token);
    if (!decoded.iat) return true;

    const date = new Date().toISOString();
    const expDate = convertUnixTimestampToDate(decoded.iat);

    if (date > expDate) {
        return true;
    }

    return false;
};
