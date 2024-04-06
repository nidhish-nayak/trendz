import dotenv from "dotenv";

dotenv.config();

const config = {
	port: process.env.PORT || 3000,
	dbConfig: {
		supabaseUrl: process.env.DB_URL,
		supabaseKey: process.env.DB_SERVICE_ROLE_KEY,

		// Incase you use RAW SQL statements - enable below
		// supabaseDirectUrl: process.env.DB_DIRECT_URL,
	},
	jwtKey: process.env.JWT_SECRET_KEY || "invalid_key",
	server:
		process.env.NODE_ENV === "production"
			? process.env.SERVER_DOMAIN
			: "localhost",
	corsOptions: {
		origin:
			process.env.NODE_ENV === "production"
				? process.env.CLIENT_URL
				: ["http://localhost:5173", "http://localhost:3000"],
		credentials: true,
		optionSuccessStatus: 200,
	},
	awsConfig: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	s3Config: {
		region: "ap-south-1",
		imageLink: process.env.S3_IMAGE_LINK,
		bucketLink: process.env.S3_BUCKET_LINK,
		cloudfrontLink: process.env.S3_CLOUDFRONT_LINK,
	},
	modOptions: {
		modStatus: true, // Toggle moderator
		modUrl: process.env.MOD_URL,
		modKey: process.env.MOD_KEY,
		modHost: process.env.MOD_HOST,
	},
	// Only for development - default always true
	guestAccess: {
		readOnly: true,
	},
	token: {
		// 1 DAY
		maxAge: 24 * 60 * 60 * 1000,
	},
};

export default config;
