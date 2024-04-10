import config from "$/config/config";
import axios from "axios";
import { supabase } from "$/db/connect";
import { addBan, getModerationAxiosConfig } from "./axios.util";
import logDetails from "./log.util";

const moderatorCheck = async (
    userId: number,
    id: number,
    post: boolean,
    imageUrl: string
) => {
    // Toggle moderator on/off as per config
    if (config.modOptions.modStatus === false || !imageUrl) {
        return;
    }

    try {
        const options = getModerationAxiosConfig(imageUrl);
        const response = await axios.request(options);

        if (response.data.unsafe === true) {
            const banAdded = await addBan(userId);
            if (banAdded === false)
                return console.log("User ban failed upon unsafe upload!");

            // Delete post or story if user banned
            if (post) {
                await logDetails(userId, imageUrl, "posts");

                const { error } = await supabase
                    .from("posts")
                    .delete()
                    .eq("userId", userId)
                    .eq("id", id);
                if (error) return console.log("Error during post delete!");
            } else {
                await logDetails(userId, imageUrl, "stories");

                const { error } = await supabase
                    .from("stories")
                    .delete()
                    .eq("userId", userId)
                    .eq("id", id);
                if (error) return console.log("Error during story delete!");
            }

            // Log the banned userId on server
            console.log(`UserId: ${userId} was banned!`);
        }
        return;
    } catch (error) {
        return console.log("Failed to request ban check from API!");
    }
};

export default moderatorCheck;
