import imageCompression from "browser-image-compression";

const compressImage = async (file: File): Promise<File> => {
    console.log(`original image size ${file.size / 1024 / 1024} MB`);

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log(
            `compressed image size ${compressedFile.size / 1024 / 1024} MB`
        );
        return compressedFile;
    } catch (error) {
        console.log(error);
        return file;
    }
};

export default compressImage;
