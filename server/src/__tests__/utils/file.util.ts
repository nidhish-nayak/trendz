import { testConfig } from "$/config/test.config";
import fs from "fs";

export const createFile = () => {
	const path = testConfig.upload.path;
	const data = testConfig.upload.data;

	// Create a temparory file in-memory
	fs.writeFileSync(path, data);
	const file = fs.createReadStream(path);
	return { file: file, path: path };
};
