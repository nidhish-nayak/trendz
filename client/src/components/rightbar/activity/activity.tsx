import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useContext, useEffect } from "react";
import { ActivityContext } from "../../../context/activityContext";
import { AuthContext } from "../../../context/authContext";
import usePostRealtime from "../../../hooks/usePostRealtime";
import { axiosRequest } from "../../../utils/axios.utils";
import Spinner from "../../spinner/spinner";
import "../rightbar.scss";
import ActivityError from "./activity.error";
import { ACTIVITY_GET_TYPES, ACTIVITY_POST_TYPES } from "./activity.types";
import ActivityItem from "./activityItem";

const Activity = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    const { isRealtime, setIsRealtime, activity, setActivity, prevActivity } =
        useContext(ActivityContext);

    if (!currentUser) throw Error("User not found!");

    const setIsRealtimeFunction = () => {
        queryClient.invalidateQueries({ queryKey: ["activities"] });
        setIsRealtime(!isRealtime);
    };

    const activityPostAddMutation = useMutation({
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

    // Listening to post channel for changes
    usePostRealtime();

    useEffect(() => {
        if (
            activity &&
            prevActivity !== activity &&
            activity.eventType === "INSERT" &&
            activityPostAddMutation.isPending === false
        ) {
            const addPostBody: ACTIVITY_POST_TYPES = {
                table_name: activity.table,
                message: "Added a new post",
                activity_created_at: activity.commit_timestamp,
                user_id: activity.new.userId,
                post_id: activity.new.id,
            };

            if (addPostBody.user_id !== currentUser.id) {
                // Essential for other user's activity refresh
                queryClient.invalidateQueries({
                    queryKey: ["activities"],
                });
            } else {
                return activityPostAddMutation.mutate(addPostBody);
            }
        }

        if (
            activity &&
            prevActivity !== activity &&
            activity.eventType === "DELETE"
        ) {
            // Deleting does not require another request - CASCADED rows
            setActivity(null);
            queryClient.invalidateQueries({ queryKey: ["activities"] });
        }
    }, [
        activity,
        activityPostAddMutation,
        currentUser.id,
        prevActivity,
        queryClient,
        setActivity,
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

    return (
        <div className="item">
            <div className="item-container">
                <div className="item-title-realtime">Latest Activities</div>
                <div
                    className="item-realtime"
                    title="Realtime updates cause heavy load on servers. Default state is set to disabled."
                    onClick={() => setIsRealtime(!isRealtime)}
                >
                    <p className="realtime-title">Realtime</p>
                    <div
                        className={`realtime-circle ${
                            !isRealtime && "offline"
                        }`}
                    />
                </div>
            </div>
            {!isRealtime && (
                <div className="user offline">Realtime activities off</div>
            )}
            {isRealtime && (
                <Fragment>
                    {data && !isLoading ? (
                        data.map((activity) => (
                            <ActivityItem
                                activity={activity}
                                key={activity.id}
                            />
                        ))
                    ) : (
                        <Spinner />
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default Activity;
