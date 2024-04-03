import Activity from "../activity/activity";
import Online from "../online/online";
import "./mobileRightbar.scss";
import Status from "./status";

const MobileRightbar = () => {
	return (
		<div className="mobile-rightbar">
			<div className="container">
				<Status />
				<Online />
				<Activity />
			</div>
		</div>
	);
};

export default MobileRightbar;
