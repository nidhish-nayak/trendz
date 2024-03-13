import { RealtimeChannel } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { supabase } from "../../../supabase/db";
import { axiosRequest } from "../../../utils/axios.utils";
import formatTime from "../../../utils/date.utils";
import Spinner from "../../spinner/spinner";
import "../rightbar.scss";
import ActivityError from "./activity.error";
import {
    ACTIVITY_GET_TYPES,
    ACTIVITY_POST_TYPES,
    REALTIME_TYPE,
} from "./activity.types";

const Activity = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    const [activity, setActivity] = useState<REALTIME_TYPE | null>(null);
    const [prevActivity, setPrevActivity] = useState<REALTIME_TYPE | null>(
        null
    );
    const [isRealtime, setIsRealtime] = useState(false);
    const setIsRealtimeFunction = () => {
        setIsRealtime(!isRealtime);
    };

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

    const activityDeleteMutation = useMutation({
        mutationFn: (table_id: number) =>
            axiosRequest.delete(`/activities/${table_id}`),
        onSuccess: () => {
            setActivity(null);
            return queryClient.invalidateQueries({ queryKey: ["activities"] });
        },
        onError(error) {
            console.error("Activity deletion failed: ", error);
        },
    });

    // Subscribe to INSERT events for posts table
    useEffect(() => {
        let postAddChannel: RealtimeChannel;

        if (isRealtime === true) {
            postAddChannel = supabase
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
            if (postAddChannel) {
                postAddChannel.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRealtime]);

    useEffect(() => {
        if (
            activity &&
            activityMutation.isPending === false &&
            prevActivity !== activity &&
            activity.eventType === "INSERT"
        ) {
            const table_name: string = activity.table;
            const message = "Added a new post";
            const activity_created_at: string = activity.commit_timestamp;
            const table_id: number = activity.new.id;
            const user_id: number = activity.new.userId;

            if (user_id !== currentUser?.id) {
                queryClient.invalidateQueries({
                    queryKey: ["activities"],
                });
            } else {
                return activityMutation.mutate({
                    table_name: table_name,
                    table_id: table_id,
                    message: message,
                    activity_created_at: activity_created_at,
                    user_id: user_id,
                });
            }
        }

        if (
            activity &&
            activityMutation.isPending === false &&
            prevActivity !== activity &&
            activity.eventType === "DELETE"
        ) {
            const table_id: number = activity.old.id;

            return activityDeleteMutation.mutate(table_id);
        }
    }, [
        activity,
        activityDeleteMutation,
        activityMutation,
        currentUser?.id,
        prevActivity,
        queryClient,
    ]);

    const getActivities = async (): Promise<ACTIVITY_GET_TYPES[]> => {
        const res = await axiosRequest.get("/activities");
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["activities"],
        queryFn: getActivities,
    });

    if (error) {
        return <ActivityError setFunction={setIsRealtimeFunction} />;
    }

    if (!isRealtime)
        return (
            <div className="item">
                <div className="item-container">
                    <div className="item-title-realtime">Latest Activities</div>
                    <div
                        className="item-realtime"
                        title="Realtime updates cause heavy load on servers. Default state is set to disabled."
                        onClick={() => setIsRealtime(true)}
                    >
                        <p className="realtime-title">Realtime</p>
                        <div className="realtime-circle offline" />
                    </div>
                </div>
                <div className="user offline">Realtime activities off</div>
            </div>
        );

    return (
        <div className="item">
            <div className="item-container">
                <div className="item-title-realtime">Latest Activities</div>
                <div
                    className="item-realtime"
                    title="Realtime updates cause heavy load on servers. Default state is set to disabled."
                    onClick={() => setIsRealtime(false)}
                >
                    <p className="realtime-title">Realtime</p>
                    <div className="realtime-circle" />
                </div>
            </div>
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
                                    {activity.message}
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
