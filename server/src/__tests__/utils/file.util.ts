import fs from "fs";
import { testConfig } from "./test.util";

export const createFile = () => {
    const path = testConfig.upload.path;
    const data = testConfig.upload.data;

    // Create a temparory file in-memory
    fs.writeFileSync(path, data);
    const file = fs.createReadStream(path);
    return { file: file, path: path };
};

// Function to create a large image file
export const createLargeFile = () => {
    const path = testConfig.upload.largeImgPath;

    const fileSize = 2048 * 2048;
    const buffer = Buffer.alloc(fileSize);

    fs.writeFileSync(path, buffer);
    const file = fs.createReadStream(path);
    return { file: file, path: path };
};
