import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../utils/axios.utils";

type TOKEN_TYPES = {
    token: boolean;
    expired: boolean;
    message: string;
};

const useHandleToken = () => {
    const navigate = useNavigate();

    const isTokenExpired = async (): Promise<TOKEN_TYPES> => {
        try {
            const res = await axiosRequest.get("/auth/status");
            return res.data;
        } catch {
            throw new Error("Failed to check token status!");
        }
    };

    const handleTokenStatus = async () => {
        try {
            const { token, expired } = await isTokenExpired();
            if (token === false || expired === true) {
                localStorage.clear();
                return navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleTokenStatus();
};

export default useHandleToken;
