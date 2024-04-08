import config from "$/config/config";

export const prefix = {
    prefixPosts: config.s3Config.cloudfrontLink + "/posts/",
    prefixStories: config.s3Config.cloudfrontLink + "/stories",
};
