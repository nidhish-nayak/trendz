import { Fragment, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import useScrollDirection from "../../hooks/useScrollDirection";

import { PostContext } from "../../context/postContext";
import Logo from "../logo/logo";
import Logout from "../logout/logout";
import Search from "../search/search";
import "./navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const scrollDirection = useScrollDirection();
    const { currentUser } = useContext(AuthContext);
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
                    <div className="user">
                        <div className="user-link" onClick={showLogout}>
                            <img
                                src={profilePic}
                                alt="logo"
                                className="user-image"
                            />
                            <span>{name}</span>
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
                    <EmailOutlinedIcon />
                    <NotificationsOutlinedIcon />
                </div>
            </div>
            <div className="bottom-mobile">
                <Link to="/" className="link" title="Home">
                    <HomeOutlinedIcon />
                </Link>
                <Link to={`/profile/${id}`} className="link" title="profile">
                    <PersonOutlinedIcon />
                </Link>
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
                <div
                    className={isPostOpen ? `post active` : "post"}
                    onClick={handlePostOpen}
                >
                    {isPostOpen ? (
                        <DisabledByDefaultOutlinedIcon />
                    ) : (
                        <AddBoxOutlinedIcon />
                    )}
                </div>
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
        </Fragment>
    );
};

export default Navbar;
