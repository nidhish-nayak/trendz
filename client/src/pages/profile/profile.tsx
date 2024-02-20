import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import PlaceIcon from "@mui/icons-material/Place";
import TwitterIcon from "@mui/icons-material/Twitter";

import { useContext, useRef, useState } from "react";
import Posts from "../../components/posts/posts";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import EditProfile from "./editProfile";
import FollowUser from "./followUser";
import "./profile.scss";
import { USER_TYPES } from "./profile.types";

const Profile = () => {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const bodyRef = useRef(document.body);

    if (!currentUser || !id) throw Error("User not found!");

    const getUsers = async (): Promise<USER_TYPES> => {
        const res = await axiosRequest.get(`/users/find/${id}`);
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    if (error) throw Error("getUsers failed!");

    if (isLoading)
        return (
            <div className="profile">
                <Spinner />
            </div>
        );

    if (!data) throw Error("No data retrieved");
    const { username, email, name, coverPic, city, website, profilePic } = data;

    const handleClick = () => {
        setIsEditOpen(!isEditOpen);
        if (isEditOpen) {
            bodyRef.current.classList.add("modal-open");
        } else {
            bodyRef.current.classList.remove("modal-open");
        }
    };

    const closeModal = () => {
        setIsEditOpen(!isEditOpen);
    };

    return (
        <div className="profile" id="profile">
            <div className="user-container">
                <div className="images">
                    <img src={coverPic} alt="Cover Photo" className="cover" />
                    <img
                        src={profilePic}
                        alt="Profile Photo"
                        className="profilePic"
                    />
                </div>
                <div className="details">
                    <div className="left">
                        <div className="name">{name}</div>
                        <div className="desc">
                            <b>Username:</b> {username}
                            <br />
                            <b>Email:</b> {email}
                        </div>
                        <FollowUser />
                    </div>

                    <div className="right">
                        <div className="more">
                            <EmailOutlinedIcon />
                            {currentUser.id !== parseInt(id) ? null : (
                                <div className="edit" onClick={handleClick}>
                                    <EditIcon fontSize="small" />
                                    Edit
                                </div>
                            )}
                            {isEditOpen ? (
                                <EditProfile
                                    closeModal={closeModal}
                                    profileData={data}
                                />
                            ) : null}
                        </div>
                        <div className="info">
                            <div className="item city">
                                <PlaceIcon />
                                <div>{city}</div>
                            </div>
                            <a
                                href={website!}
                                title={website!}
                                className="item"
                            >
                                <LanguageIcon />
                            </a>
                        </div>
                        <div className="social-links">
                            <a href="http://facebook.com">
                                <FacebookTwoToneIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <InstagramIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <TwitterIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <LinkedInIcon fontSize="medium" />
                            </a>
                            <a href="http://facebook.com">
                                <PinterestIcon fontSize="medium" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Posts />
        </div>
    );
};

export default Profile;
