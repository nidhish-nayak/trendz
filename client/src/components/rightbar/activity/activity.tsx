import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useContext } from "react";

import { ActivityContext } from "../../../context/activityContext";
import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import { ACTIVITY_GET_TYPES } from "./activity.types";

import Spinner from "../../spinner/spinner";
import "../rightbar.scss";
import ActivityError from "./activity.error";
import ActivityItem from "./activityItem";

import useCommentActivity from "../../../hooks/activities/useCommentActivity";
import usePostActivity from "../../../hooks/activities/usePostActivity";
import useCommentChannel from "../../../hooks/realtime/useCommentChannel";
import usePostChannel from "../../../hooks/realtime/usePostChannel";

const Activity = () => {
	const queryClient = useQueryClient();
	const { currentUser } = useContext(AuthContext);
	const { isRealtime, setIsRealtime } = useContext(ActivityContext);

	if (!currentUser) throw Error("User not found!");

	const setIsRealtimeFunction = () => {
		queryClient.invalidateQueries({ queryKey: ["activities"] });
		setIsRealtime(!isRealtime);
	};

	// Listening to realtime post & comment channel for changes
	usePostChannel();
	useCommentChannel();

	// Mutate activity table on changes detected from channels
	usePostActivity();
	useCommentActivity();

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
