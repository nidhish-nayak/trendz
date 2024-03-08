import { supabase } from "../db";

export const channels = supabase
    .channel("inserted-post")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => console.log(payload)
    )
    .subscribe();
