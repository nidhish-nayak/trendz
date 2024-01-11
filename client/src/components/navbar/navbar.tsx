import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
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
import "./navbar.scss";

const Navbar = () => {
    const { darkMode, toggleTheme } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);
    const scrollDirection = useScrollDirection();
    const { name, profilePic } = currentUser!;

    // Define a state to track whether to show or hide the navbar
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    useEffect(() => {
        // Toggle visibility based on the scroll direction
        setIsNavbarVisible(scrollDirection === "up");
    }, [scrollDirection]);

    return (
        <Fragment>
            <div className="navbar-main">
                <div className="left">
                    <Link
                        to="/"
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        <div className="logo-link">
                            Link<span>X.</span>
                        </div>
                    </Link>
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
                    <div className="search">
                        <SearchOutlinedIcon />
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
                <div className="right">
                    <PersonOutlinedIcon />
                    <EmailOutlinedIcon />
                    <NotificationsOutlinedIcon />
                    <div className="user">
                        <img src={profilePic} alt="logo" />
                        <span>{name}</span>
                    </div>
                </div>
            </div>
            <div
                className={`top-mobile ${
                    isNavbarVisible ? "visible" : "hidden"
                }`}
            >
                <div className="left-mobile">
                    <Link
                        to="/"
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        <div className="logo-link">
                            Link<span>X.</span>
                        </div>
                    </Link>
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
                <div className="search">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search..." />
                </div>
                <AppsOutlinedIcon />
                <div className="user">
                    <img src={profilePic} alt="logo" />
                </div>
            </div>
        </Fragment>
    );
};

export default Navbar;
