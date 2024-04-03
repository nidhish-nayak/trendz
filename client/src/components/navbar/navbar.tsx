import { Fragment, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";

import CancelIcon from "@mui/icons-material/Cancel";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import useScrollDirection from "../../hooks/useScrollDirection";

import {
	Chat,
	Close,
	ExploreOutlined,
	ExploreTwoTone,
	GitHub,
	Groups3Outlined,
	Home,
	Menu,
	MonitorHeart,
	NotificationAdd,
	PersonSearchOutlined,
	SearchOff,
} from "@mui/icons-material";
import PostSVG from "../../assets/PostSVG";
import { OnlineContext } from "../../context/onlineContext";
import { PostContext } from "../../context/postContext";
import Logo from "../logo/logo";
import Logout from "../logout/logout";
import Search from "../search/search";
import Soon from "../soon/soon";
import "./navbar.scss";

const Navbar = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const scrollDirection = useScrollDirection();
	const { currentUser } = useContext(AuthContext);
	const { isOnline } = useContext(OnlineContext);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isPostOpen, setIsPostOpen } = useContext(PostContext);
	const { darkMode, toggleTheme } = useContext(DarkModeContext);

	if (!currentUser) {
		throw Error("User not found");
	}

	const { id, name, profilePic, email, username, city, website, coverPic } =
		currentUser;

	const [logout, setLogout] = useState(false);
	const [searchPortal, setSearchPortal] = useState(false);
	const [isNavbarVisible, setIsNavbarVisible] = useState(true);

	useEffect(() => {
		// Toggle visibility based on the scroll direction
		setIsNavbarVisible(scrollDirection === "up");
	}, [scrollDirection]);

	const showLogout = () => {
		setLogout(!logout);
	};

	const handlePostOpen = () => {
		navigate("/");
		window.scrollTo(0, 0);
		return setIsPostOpen();
	};

	return (
		<Fragment>
			<div className="navbar-main">
				<div className="left">
					<Logo />
					<Link to="/" className="link" title="Home">
						<HomeOutlinedIcon />
					</Link>
					<div
						className="theme"
						onClick={toggleTheme}
						title="Toggle theme"
					>
						{darkMode ? (
							<LightModeOutlinedIcon />
						) : (
							<DarkModeOutlinedIcon />
						)}
					</div>
					<Search />
				</div>
				<div className="right">
					<div
						className="item-realtime"
						title={
							username === "guest"
								? "Plese sign-up for full-access."
								: ""
						}
					>
						<p className="realtime-title">
							{username === "guest" ? "Read Only" : "Full Access"}
						</p>
						<div
							className={`realtime-circle ${username === "guest" ? "read-only" : "online"}`}
						/>
					</div>
					<div className="user">
						<div className="user-link" onClick={showLogout}>
							<img
								src={profilePic}
								alt="logo"
								className="user-image"
							/>
							<span title={name}>{name}</span>
						</div>
						<Logout
							isOpen={logout}
							id={id}
							image={profilePic}
							name={name}
							city={city}
							username={username}
							email={email}
							coverPic={coverPic}
							website={website}
						/>
					</div>
				</div>
			</div>
			<div
				className={`top-mobile ${
					isNavbarVisible ? "visible" : "hidden"
				}`}
			>
				<div className="left-mobile">
					<Logo />
				</div>
				<div className="right-mobile">
					<div
						className="item-realtime"
						title="Status"
						onClick={() => navigate("/activities")}
					>
						<p className="realtime-title">Status</p>
						<div
							className={`realtime-circle ${currentUser.username === "guest" ? "read-only" : isOnline ? "online" : "offline"}`}
						/>
					</div>
					<div
						className="theme"
						onClick={toggleTheme}
						title="Toggle theme"
					>
						{darkMode ? (
							<LightModeOutlinedIcon />
						) : (
							<DarkModeOutlinedIcon />
						)}
					</div>
					<div
						className="theme"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<Menu />
					</div>
				</div>
			</div>
			<div className="bottom-mobile">
				<Link to="/" className="link" title="Home">
					<Home />
				</Link>
				{pathname === "/" ? (
					<div className="search-mobile">
						{!searchPortal && (
							<SearchOutlinedIcon
								onClick={() => setSearchPortal(!searchPortal)}
							/>
						)}
						{searchPortal && (
							<CancelIcon
								onClick={() => setSearchPortal(!searchPortal)}
							/>
						)}
						{searchPortal &&
							createPortal(
								<Search />,
								document.getElementById("home")!
							)}
					</div>
				) : (
					<div className="search-mobile">
						<SearchOff />
					</div>
				)}
				<div
					className={isPostOpen ? `post active` : "post"}
					onClick={handlePostOpen}
				>
					{isPostOpen ? (
						<DisabledByDefaultOutlinedIcon />
					) : (
						<PostSVG />
					)}
				</div>
				<Link to={`/explore`} className="link" title="explore">
					{pathname === "/explore" ? (
						<ExploreTwoTone />
					) : (
						<ExploreOutlined />
					)}
				</Link>
				<div className="user" onClick={showLogout}>
					<img src={profilePic} alt="logo" className="user-image" />
					<Logout
						isOpen={logout}
						id={id}
						image={profilePic}
						name={name}
						city={city}
						username={username}
						email={email}
						coverPic={coverPic}
						website={website}
					/>
				</div>
			</div>
			{isMenuOpen && (
				<div
					className={
						isMenuOpen
							? `menu-container menu-open`
							: "menu-container"
					}
				>
					<ul className="menu-list">
						<div
							className="menu-close"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<Close />
						</div>
						<Link
							to="/findPeople"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<PersonSearchOutlined className="large" />
							<li className="menu-items">Find People</li>
						</Link>
						<Link
							to="/friends"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<Groups3Outlined className="large" />
							<li className="menu-items">Friend List</li>
						</Link>
						<Link
							to="/activities"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<MonitorHeart className="large" />
							<li className="menu-items">Activities</li>
						</Link>
						<Link to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							<Soon />
							<NotificationAdd className="large" />
							<li className="menu-items">Notifications</li>
						</Link>
						<Link to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							<Soon />
							<Chat className="large" />
							<li className="menu-items">Chat</li>
						</Link>
						<Link
							to="https://github.com/nidhish-nayak/trendz"
							target="_blank"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<GitHub className="large" />
							<li className="menu-items">Github</li>
						</Link>
					</ul>
				</div>
			)}
		</Fragment>
	);
};

export default Navbar;
