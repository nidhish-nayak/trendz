import { AxiosError } from "axios";
import { axiosRequest } from "./axios.utils";

const upload = async (file: File, folder: string) => {
    try {
        const formData = new FormData();
        // Any req.body must be sent before file - Multer issue
        formData.append("folder", folder);
        formData.append("file", file);

        const res = await axiosRequest.post("/upload", formData);
        return res.data;
    } catch (error) {
        const { response } = error as AxiosError;
        console.log(response?.data);
        alert(response?.data);
    }
};

export default upload;
