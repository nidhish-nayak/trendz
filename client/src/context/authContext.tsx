import axios, { AxiosError } from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

import config from "../config/config";
import { LoginResponseTypes, LoginTypes } from "../pages/login/login.types";
import { USER_TYPES } from "../pages/profile/profile.types";

export type AuthContextTypes = {
    currentUser: {
        id: number;
        name: string;
        profilePic: string;
        email: string;
        username: string;
        website: string;
        city: string;
        coverPic: string;
    } | null;
    setCurrentUserHandler: (data: USER_TYPES) => void;
    login: (inputs: LoginTypes) => Promise<LoginResponseTypes>;
};

export const AuthContext = createContext<AuthContextTypes>({
    currentUser: null,
    setCurrentUserHandler: () => {},
    login: () => Promise.resolve({ isLoggedIn: false, response: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return JSON.parse(storedUser!);
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    const setCurrentUserHandler = (data: USER_TYPES) => {
        localStorage.setItem("user", JSON.stringify(data));
        setCurrentUser(data);
    };

    const login = async (inputs: LoginTypes): Promise<LoginResponseTypes> => {
        const API_URL = `${config.serverUrl}/api/auth/login`;

        try {
            const res = await axios.post(API_URL, inputs, {
                withCredentials: true,
            });
            setCurrentUser(res.data);

            return { isLoggedIn: true, response: "User logged in!" };
        } catch (error) {
            const err = error as AxiosError;
            console.error(err.response?.data);

            return {
                isLoggedIn: false,
                response: JSON.parse(JSON.stringify(err.response?.data)),
            };
        }
    };

    const value = { currentUser, setCurrentUserHandler, login };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
