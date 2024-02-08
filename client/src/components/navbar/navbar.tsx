import { Fragment, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import useScrollDirection from "../../hooks/useScrollDirection";

import Logo from "../logo/logo";
import Logout from "../logout/logout";
import Search from "../search/search";
import "./navbar.scss";

const Navbar = () => {
    const scrollDirection = useScrollDirection();
    const { currentUser } = useContext(AuthContext);
    const { darkMode, toggleTheme } = useContext(DarkModeContext);

    const { name, profilePic, email, username, city, website, coverPic } =
        currentUser!;

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

    return (
        <Fragment>
            <div className="navbar-main">
                <div className="left">
                    <Logo />
                    <Link to="/" className="home-link" title="Home">
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
                    <AppsOutlinedIcon />
                    <Search />
                </div>
                <div className="right">
                    <PersonOutlinedIcon />
                    <EmailOutlinedIcon />
                    <NotificationsOutlinedIcon />
                    <div className="user" onClick={showLogout}>
                        <img
                            src={profilePic}
                            alt="logo"
                            className="user-image"
                        />
                        <Logout
                            isOpen={logout}
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
                <Link to="/" className="home-link" title="Home">
                    <HomeOutlinedIcon />
                </Link>
                <PersonOutlinedIcon />
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
                <AppsOutlinedIcon />
                <div className="user" onClick={showLogout}>
                    <img src={profilePic} alt="logo" className="user-image" />
                    <Logout
                        isOpen={logout}
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
