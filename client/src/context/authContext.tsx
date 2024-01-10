import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { LoginTypes } from "../types/login.types";

export type AuthContextTypes = {
    currentUser: { id: number; name: string; profilePic: string } | null;
    login: (inputs: LoginTypes) => void;
};

export const AuthContext = createContext<AuthContextTypes>({
    currentUser: null,
    login: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        // returning null if no storedUser
        return JSON.parse(storedUser!);
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    const login = async (inputs: LoginTypes) => {
        const API_URL =
            process.env.NODE_ENV === "production"
                ? `${process.env.SERVER_URL}/api/auth/login`
                : "http://localhost:3000/api/auth/register";
        const res = await axios.post(API_URL, inputs, {
            withCredentials: true,
        });

        setCurrentUser(res.data);
    };

    const value = { currentUser, login };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
