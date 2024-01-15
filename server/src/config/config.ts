require("dotenv").config();

const config = {
    port: process.env.PORT || 3000,
    dbConfig: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "linkx-db",
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
