import config from "$/config/config";
import { S3Client } from "@aws-sdk/client-s3";

if (!config.awsConfig.accessKeyId || !config.awsConfig.secretAccessKey)
	throw new Error("AWS keys not found!");

const s3 = new S3Client({
	credentials: {
		accessKeyId: config.awsConfig.accessKeyId,
		secretAccessKey: config.awsConfig.secretAccessKey,
	},
	region: "ap-south-1",
});

export default s3;
