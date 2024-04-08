import axios, { AxiosError } from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config/config";
import "./logout.scss";
import { LogoutProps } from "./logout.types";

const Logout: React.FC<LogoutProps> = (props) => {
    const navigate = useNavigate();
    const {
        isOpen,
        id,
        image,
        name,
        city,
        username,
        coverPic,
        website,
        email,
    } = props;

    const userLogout = async () => {
        const API_URL = `${config.serverUrl}/api/auth/logout`;

        try {
            const res = await axios.post(API_URL);
            if (res.status === 200) {
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                alert("logout failed!");
            }
        } catch (error) {
            const err = error as AxiosError;
            console.error(err);
        }
    };

    return isOpen ? (
        <div className="logout-container">
            <div className="logout-items">
                <img
                    src={coverPic}
                    alt="cover-picture"
                    className="logout-cover"
                />
                <img
                    src={image}
                    alt="profile-picture"
                    className="logout-image"
                />
                <div className="logout-user">
                    <p className="user-items">
                        Name: <span title={name}>{name}</span>
                    </p>
                    <p className="user-items">
                        Email: <span title={email}>{email}</span>
                    </p>
                    <p className="user-items">
                        Username: <span title={username}>{username}</span>
                    </p>
                    {city || website ? (
                        <>
                            <p className="user-items">
                                City: <span title={city}>{city}</span>
                            </p>
                            <p className="user-items">
                                Website: <span title={website}>{website}</span>
                            </p>
                        </>
                    ) : null}
                </div>
            </div>
            <div className="logout-button-container">
                <button className="logout-button" onClick={userLogout}>
                    Logout
                </button>
                <Link to={`/profile/${id}`} className="profile-edit">
                    Profile
                </Link>
            </div>
        </div>
    ) : null;
};

export default Logout;
