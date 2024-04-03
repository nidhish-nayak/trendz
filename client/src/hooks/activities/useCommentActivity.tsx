import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { ACTIVITY_COMMENT_TYPES } from "../../components/rightbar/activity/activity.types";
import { ActivityContext } from "../../context/activityContext";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";

const useCommentActivity = () => {
	const queryClient = useQueryClient();
	const { currentUser } = useContext(AuthContext);
	const { activity, prevActivity, setActivity } = useContext(ActivityContext);

	if (!currentUser) throw Error("User not found!");

	const activityCommentAddMutation = useMutation({
		mutationFn: (body: ACTIVITY_COMMENT_TYPES) =>
			axiosRequest.post("/activities", body),
		onSuccess: () => {
			setActivity(null);
			return queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
		onError(error) {
			console.error("Activity mutation failed: ", error);
		},
	});

	// Handle post activity changes on realtime comment updates
	useEffect(() => {
		if (
			activity &&
			prevActivity !== activity &&
			activity.table === "comments" &&
			activity.eventType === "INSERT" &&
			activityCommentAddMutation.isPending === false
		) {
			const addPostBody: ACTIVITY_COMMENT_TYPES = {
				table_name: activity.table,
				message: "Commented on post",
				activity_created_at: activity.commit_timestamp,
				user_id: activity.new.userId,
				post_id: activity.new.postId,
				comment_id: activity.new.id,
			};

			if (addPostBody.user_id !== currentUser.id) {
				// Essential for other user's activity to refresh
				queryClient.invalidateQueries({
					queryKey: ["activities"],
				});
			} else {
				return activityCommentAddMutation.mutate(addPostBody);
			}
		}

		if (
			activity &&
			prevActivity !== activity &&
			activity.table === "comments" &&
			activity.eventType === "DELETE"
		) {
			// Deleting does not require another request - CASCADED rows
			setActivity(null);
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		}
	}, [
		activity,
		activityCommentAddMutation,
		currentUser.id,
		prevActivity,
		queryClient,
		setActivity,
	]);
};

export default useCommentActivity;
