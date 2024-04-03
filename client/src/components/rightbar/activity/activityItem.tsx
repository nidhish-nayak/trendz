import { Link } from "react-router-dom";
import formatTime from "../../../utils/date.utils";
import { ACTIVITY_GET_TYPES } from "./activity.types";

const ActivityItem = ({ activity }: { activity: ACTIVITY_GET_TYPES }) => {
	const {
		id,
		profilePic,
		name,
		message,
		activity_created_at,
		table_name,
		post_id,
	} = activity;

	return (
		<div className="user" key={id}>
			<div className="userInfo">
				<img src={profilePic} alt="user-image" />
				<div className="activity-container">
					<div>
						<span className="user-name" title="username">
							{name}
						</span>
						<p className="user-time">
							{formatTime(new Date(activity_created_at))}
						</p>
					</div>
					<p className="user-activity">
						{message}
						{table_name === "posts" || table_name === "comments" ? (
							<Link to={`/post/${post_id}`}>#{post_id}</Link>
						) : null}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ActivityItem;
