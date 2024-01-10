require("dotenv").config();

const config = {
    port: process.env.PORT || 3000,
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwtKey: process.env.JWT_SECRET_KEY,
    corsOptions: {
        origin: "http://localhost:5173",
        credentials: true,
        optionSuccessStatus: 200,
    },
};

export default config;
