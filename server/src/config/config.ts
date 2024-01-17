require("dotenv").config();

const config = {
    port: process.env.PORT || 3000,
    dbConfig: {
        supabaseUrl: process.env.DB_URL,
        supabaseKey: process.env.DB_SERVICE_ROLE_KEY,
    },
    jwtKey: process.env.JWT_SECRET_KEY,
    corsOptions: {
        origin:
            process.env.NODE_ENV === "production"
                ? process.env.CLIENT_URL
                : process.env.LOCAL_CLIENT_URL,
        credentials: true,
        optionSuccessStatus: 200,
    },
};

export default config;
