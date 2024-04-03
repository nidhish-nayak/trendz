import Activity from "./activity/activity";
import Online from "./online/online";
import "./rightbar.scss";
import Suggested from "./suggested/suggested";

const Rightbar = () => {
	return (
		<div className="rightbar">
			<div className="container">
				<Suggested />
				<Online />
				<Activity />
			</div>
		</div>
	);
};

export default Rightbar;
