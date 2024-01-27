import { AxiosError } from "axios";
// import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../utils/axios.utils";

export const getAllPosts = async () => {
    // const navigate = useNavigate();

    try {
        const res = await axiosRequest.get("/posts");
        return res.data;
    } catch (error) {
        const err = error as AxiosError;
        if (err?.response?.status) {
            localStorage.removeItem("user");
            // navigate("/login");
            alert("Please login again!");
        }
    }
};
