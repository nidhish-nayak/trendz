import config from "$/config/config";
import axios from "axios";
import { supabase } from "$/db/connect";
import { addBan, getModerationAxiosConfig } from "./axios.util";
import logDetails from "./log.util";

const moderatorCheck = async (
    id: number,
    table: string,
    userId: number,
    imageUrl: string
) => {
    // Deletable tables
    const allowedTables = ["posts", "stories"];

    // Toggle moderator on/off as per config
    if (
        config.modOptions.modStatus === false ||
        !imageUrl ||
        !allowedTables.includes(table)
    ) {
        return;
    }

    try {
        const options = getModerationAxiosConfig(imageUrl);
        const response = await axios.request(options);

        if (response.data.unsafe === true) {
            const banAdded = await addBan(userId);
            if (banAdded === false) return;

            // Delete post or story if user banned
            await logDetails(userId, imageUrl, table);

            const { error } = await supabase
                .from(table)
                .delete()
                .eq("userId", userId)
                .eq("id", id);
            if (error) return;
        }
        return;
    } catch (error) {
        return;
    }
};

export default moderatorCheck;
