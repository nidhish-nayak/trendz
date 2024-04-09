import config from "$/config/config";
import { Response } from "express";
import axios from "axios";

import { addBan, getModerationAxiosConfig } from "$/utils/axios.util";
import clearAllCookies from "$/utils/cookie.util";
import { supabase } from "$/db/connect";

const moderatorCheck = async (
    res: Response,
    userId: number,
    id: number,
    post: boolean,
    imageUrl: string
) => {
    // Toggle moderator on/off as per config
    if (config.modOptions.modStatus === false || !imageUrl) {
        return;
    }

    // Get axios headers setup
    const options = getModerationAxiosConfig(imageUrl);

    try {
        const response = await axios.request(options);
        if (response.data.unsafe === true) {
            const banAdded = await addBan(userId);
            if (banAdded === false)
                return console.log("User ban failed upon unsafe upload!");

            // Delete post or story if user banned
            if (post) {
                // Add logs of images for unban requests
                const { error: logError } = await supabase
                    .from("logs")
                    .insert({ user_id: userId, img: imageUrl, type: "post" });
                if (logError) return console.log("Error during post log!");

                // Remove actual post
                const { error } = await supabase
                    .from("posts")
                    .delete()
                    .eq("userId", userId)
                    .eq("id", id);
                if (error) return console.log("Error during post delete!");
            } else {
                const { error: logError } = await supabase
                    .from("logs")
                    .insert({ user_id: userId, img: imageUrl, type: "story" });
                if (logError) return console.log("Error logging story delete!");

                // Remove actual story
                const { error } = await supabase
                    .from("stories")
                    .delete()
                    .eq("userId", userId)
                    .eq("id", id);
                if (error) return console.log("Error during Story delete!");
            }

            // Logout user on ban
            clearAllCookies(res);
        }
        return;
    } catch (error) {
        if (error.code === "ERR_HTTP_HEADERS_SENT") {
            return console.log("User was banned, cookie was cleared");
        }
        return console.log("Failed to request ban check from API!");
    }
};

export default moderatorCheck;
