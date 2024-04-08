import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { ActivityContext } from "../../context/activityContext";
import { supabase } from "../../supabase/db";

const usePostChannel = () => {
    const queryClient = useQueryClient();
    const { isRealtime, activity, setActivity, setPrevActivity } =
        useContext(ActivityContext);

    // Subscribe to INSERT events for posts table
    useEffect(() => {
        let postChannel: RealtimeChannel;

        if (isRealtime === true) {
            postChannel = supabase
                .channel("inserted-post")
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "posts" },
                    (payload) => {
                        setPrevActivity(activity);
                        setActivity(payload);
                        queryClient.invalidateQueries({
                            queryKey: ["activities"],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["posts"],
                        });
                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event: "DELETE",
                        schema: "public",
                        table: "posts",
                    },
                    (payload) => {
                        setPrevActivity(activity);
                        setActivity(payload);
                        queryClient.invalidateQueries({
                            queryKey: ["activities"],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["posts"],
                        });
                    }
                )
                .subscribe();
        }

        return () => {
            if (postChannel) {
                postChannel.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRealtime]);
};

export default usePostChannel;
