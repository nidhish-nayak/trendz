import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { ActivityContext } from "../../context/activityContext";
import { supabase } from "../../supabase/db";

const useCommentChannel = () => {
    const queryClient = useQueryClient();
    const { isRealtime, activity, setActivity, setPrevActivity } =
        useContext(ActivityContext);

    // Subscribe to INSERT events for posts table
    useEffect(() => {
        let commentChannel: RealtimeChannel;

        if (isRealtime === true) {
            commentChannel = supabase
                .channel("inserted-comment")
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "comments" },
                    (payload) => {
                        setPrevActivity(activity);
                        setActivity(payload);
                        queryClient.invalidateQueries({
                            queryKey: ["activities"],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["comments"],
                        });
                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event: "DELETE",
                        schema: "public",
                        table: "comments",
                    },
                    (payload) => {
                        setPrevActivity(activity);
                        setActivity(payload);
                        queryClient.invalidateQueries({
                            queryKey: ["activities"],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["comments"],
                        });
                    }
                )
                .subscribe();
        }

        return () => {
            if (commentChannel) {
                commentChannel.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRealtime]);
};

export default useCommentChannel;
