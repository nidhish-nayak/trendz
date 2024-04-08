import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import useHandleToken from "../hooks/useHandleToken";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useContext(AuthContext);
    useHandleToken(); // Check if accessToken valid

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return children;
};
