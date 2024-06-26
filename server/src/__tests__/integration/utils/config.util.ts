import config from "$/config/config";
import dotenv from "dotenv";
dotenv.config();

if (
    !process.env.QA_NAME ||
    !process.env.QA_EMAIL ||
    !process.env.QA_USERNAME ||
    !process.env.QA_PASSWORD ||
    !process.env.QA_NAME_EXISTS ||
    !process.env.QA_EMAIL_EXISTS ||
    !process.env.QA_USERNAME_EXISTS ||
    !process.env.QA_PASSWORD_EXISTS
) {
    throw Error(".env TEST USER SETUP not found!");
}

export const testConfig = {
    // Must store unsafe image in same path inside S3 for ban tests if enabled
    banImg: config.s3Config.cloudfrontLink + "/ban/ban.webp",
    upload: {
        largeImgPath: "./src/__tests__/integration/utils/assets/test-large.png",
        path: "./src/__tests__/integration/utils/assets/test.png",
        data: "test data",
    },
    s3Path: {
        posts: config.s3Config.cloudfrontLink + "/posts",
        stories: config.s3Config.cloudfrontLink + "/stories",
    },
};

export const user = {
    name: process.env.QA_NAME,
    email: process.env.QA_EMAIL,
    username: process.env.QA_USERNAME,
    password: process.env.QA_PASSWORD,
};

export const ExistingUser = {
    name: process.env.QA_NAME_EXISTS,
    email: process.env.QA_EMAIL_EXISTS,
    username: process.env.QA_USERNAME_EXISTS,
    password: process.env.QA_PASSWORD_EXISTS,
};

export const GuestUser = {
    name: process.env.QA_NAME_GUEST,
    email: process.env.QA_EMAIL_GUEST,
    username: process.env.QA_USERNAME_GUEST,
    password: process.env.QA_PASSWORD_GUEST,
};

// Alternate user if needed
export const userAlt = {
    name: process.env.QA_NAME + "-test2",
    email: "test2-" + process.env.QA_EMAIL,
    username: process.env.QA_USERNAME + "-test2",
    password: process.env.QA_PASSWORD + "-test2",
};
