import { supabase } from "../db";

export const postChannel = () => {
    let payloadData;
    supabase
        .channel("inserted-post")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            (payload) => {
                payloadData = payload;
            }
        );
    return payloadData;
};
