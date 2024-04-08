import config from "$/config/config";
import { supabase } from "$/db/connect";

export const getModerationAxiosConfig = (imgUrl: string) => {
    return {
        method: "POST",
        url: config.modOptions.modUrl,
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": config.modOptions.modKey,
            "X-RapidAPI-Host": config.modOptions.modHost,
        },
        data: {
            url: imgUrl,
        },
    };
};

export const addBan = async (user_id: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from("bans")
        .insert({ user_id: user_id })
        .select();

    if (error) return false;
    if (data) return true;
    return false;
};
