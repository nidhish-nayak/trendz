import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/db";
import { axiosRequest } from "../../../utils/axios.utils";
import formatTime from "../../../utils/date.utils";
import Spinner from "../../spinner/spinner";
import "../rightbar.scss";
import {
    ACTIVITY_GET_TYPES,
    ACTIVITY_POST_TYPES,
    REALTIME_TYPE,
} from "./activity.types";

const Activity = () => {
    const queryClient = useQueryClient();
    const [activity, setActivity] = useState<REALTIME_TYPE | null>(null);
    const [prevActivity, setPrevActivity] = useState<REALTIME_TYPE | null>(
        null
    );

    const activityMutation = useMutation({
        mutationFn: (body: ACTIVITY_POST_TYPES) =>
            axiosRequest.post("/activities", body),
        onSuccess: () => {
            setActivity(null);
            return queryClient.invalidateQueries({ queryKey: ["activities"] });
        },
        onError(error) {
            console.error("Activity mutation failed: ", error);
        },
    });

    // Subscribe to INSERT events for posts table
    useEffect(() => {
        const postChannel = supabase
            .channel("inserted-post")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "posts" },
                (payload) => {
                    setPrevActivity(activity);
                    setActivity(payload);
                }
            )
            .subscribe();

        return () => {
            postChannel.unsubscribe();
        };
    }, [activity]);

    useEffect(() => {
        if (
            activity &&
            activityMutation.isPending === false &&
            prevActivity !== activity
        ) {
            const table_name: string = activity.table;
            const table_id: number = activity.new.id;
            const message = "Added a new post";
            const activity_created_at: string = activity.commit_timestamp;
            const user_id: number = activity.new.userId;

            activityMutation.mutate({
                table_name: table_name,
                table_id: table_id,
                message: message,
                activity_created_at: activity_created_at,
                user_id: user_id,
            });
        }
        // DO NOT PUT activityMutation as a dependency, this will re-render infinitely
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity]);

    console.log(activity);

    const getActivities = async (): Promise<ACTIVITY_GET_TYPES[]> => {
        const res = await axiosRequest.get("/activities");
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["activities"],
        queryFn: getActivities,
    });

    if (error)
        return (
            <div className="item">
                <span>Latest Activities</span>
                <p>Server Error</p>
            </div>
        );

    return (
        <div className="item">
            <span>Latest Activities</span>
            {isLoading || !data ? (
                <Spinner />
            ) : (
                data.map((activity) => (
                    <div className="user" key={activity.id}>
                        <div className="userInfo">
                            <img src={activity.profilePic} alt="user-image" />
                            <div className="activity-container">
                                <div>
                                    <span
                                        className="user-name"
                                        title="username"
                                    >
                                        {activity.name}
                                    </span>
                                    <p className="user-time">
                                        {formatTime(
                                            new Date(
                                                activity.activity_created_at
                                            )
                                        )}
                                    </p>
                                </div>

                                <p className="user-activity">
                                    {activity.message} #{activity.table_id}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Activity;
