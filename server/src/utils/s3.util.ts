import config from "$/config/config";
import { S3Client } from "@aws-sdk/client-s3";

if (!config.awsConfig.accessKeyId || !config.awsConfig.secretAccessKey)
	throw new Error("AWS keys not found!");

const s3 = new S3Client({
	credentials: {
		accessKeyId: config.awsConfig.accessKeyId,
		secretAccessKey: config.awsConfig.secretAccessKey,
	},
	region: config.s3Config.region,
});

export default s3;
