import dotenv from "dotenv";

dotenv.config();

const config = {
	port: process.env.PORT || 3000,
	dbConfig: {
		supabaseUrl: process.env.DB_URL,
		supabaseKey: process.env.DB_SERVICE_ROLE_KEY,
		supabaseDirectUrl: process.env.DB_DIRECT_URL,
	},
	jwtKey: process.env.JWT_SECRET_KEY || "invalid_key",
	corsOptions: {
		origin:
			process.env.NODE_ENV === "production"
				? process.env.CLIENT_URL
				: process.env.LOCAL_CLIENT_URL,
		credentials: true,
		optionSuccessStatus: 200,
	},
	awsConfig: {
		accessKeyId: process.env.accessKeyId,
		secretAccessKey: process.env.secretAccessKey,
	},
	s3Config: {
		s3BucketLink: process.env.s3BucketLink,
		s3ImageLink: process.env.s3ImageLink,
	},
};

export default config;
