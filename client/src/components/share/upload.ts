import { axiosRequest } from "../../utils/axios.utils";

const upload = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axiosRequest.post("/upload", formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export default upload;
