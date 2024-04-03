import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { PostContext } from "../../context/postContext";
import "./leftbar.scss";

import {
	GitHub,
	Groups3Outlined,
	HomeOutlined,
	MarkUnreadChatAltOutlined,
	MonitorHeart,
	NotificationsActiveOutlined,
	TravelExploreOutlined,
} from "@mui/icons-material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import ExploreIcon from "@mui/icons-material/Explore";
import Soon from "../soon/soon";

const Leftbar = () => {
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);
	const { isPostOpen, setIsPostOpen } = useContext(PostContext);
	if (!currentUser) throw Error("User not logged in!");

	const { id, profilePic } = currentUser;

	const handleProfileNavigate = () => {
		return navigate(`/profile/${id}`);
	};

	const handlePostOpen = () => {
		navigate("/");
		window.scrollTo(0, 0);
		return setIsPostOpen();
	};

	return (
		<div className="leftbar">
			<div className="container">
				<div className="menu">
					<div className="item" onClick={handleProfileNavigate}>
						<img src={profilePic} alt="user-image" />
						<span style={{ fontWeight: "500" }}>Profile</span>
					</div>
					<Link
						to="/"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item">
							<HomeOutlined />
							<span>Home</span>
						</div>
					</Link>
					<Link
						to="/friends"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item">
							<Groups3Outlined />
							<span>Friends</span>
						</div>
					</Link>
				</div>
				<hr />
				<div className="menu">
					<span className="menu-heading">Explore</span>
					<Link
						to="/explore"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item">
							<ExploreIcon />
							<span>Explore</span>
						</div>
					</Link>
					<div
						className={isPostOpen ? `item active` : "item inactive"}
						onClick={handlePostOpen}
					>
						{isPostOpen ? (
							<>
								<DisabledByDefaultOutlinedIcon />
								<span>Cancel</span>
							</>
						) : (
							<>
								<AddBoxOutlinedIcon />
								<span>Add Post</span>
							</>
						)}
					</div>
					<Link
						to="/findPeople"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item">
							<TravelExploreOutlined />
							<span>Find People</span>
						</div>
					</Link>
					<Link
						to="/activities"
						className="tablet"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item tablet">
							<MonitorHeart />
							<span>Activities</span>
						</div>
					</Link>
				</div>
				<hr />
				<div className="menu">
					<span className="menu-heading">Others</span>
					<Link
						to="/"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item">
							<NotificationsActiveOutlined />
							<span>Notifications</span>
							<Soon />
						</div>
					</Link>
					<Link
						to="/"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
					>
						<div className="item">
							<MarkUnreadChatAltOutlined />
							<span>Chat</span>
							<Soon />
						</div>
					</Link>
					<a
						href="https://github.com/nidhish-nayak/trendz"
						style={{
							textDecoration: "none",
							color: "inherit",
						}}
						target="_blank"
					>
						<div className="item">
							<GitHub />
							<span>Github</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Leftbar;
