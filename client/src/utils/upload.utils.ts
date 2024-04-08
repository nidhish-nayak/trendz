import { AxiosError } from "axios";
import { axiosRequest } from "./axios.utils";
import compressImage from "./compress.utils";

const upload = async (file: File, folder: string) => {
    let uploadFile = file;

    if (file.size > 1048576) {
        const compressedFile = await compressImage(file);
        uploadFile = new File([compressedFile], file.name, { type: file.type });
    }

    try {
        const formData = new FormData();
        // Any req.body must be sent before file - Multer issue
        formData.append("folder", folder);
        formData.append("file", uploadFile);

        const res = await axiosRequest.post("/upload", formData);
        return res.data;
    } catch (error) {
        const { response } = error as AxiosError;
        console.log(response?.data);
        alert(response?.data);
    }
};

export default upload;
