import { testConfig } from "$/config/test.config";
import fs from "fs";

export const createFile = () => {
	const filePath = testConfig.posts.testImagePath;
	const fileContent = testConfig.posts.testImageContent;

	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, fileContent);
	}
};
