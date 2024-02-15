import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PinterestIcon from "@mui/icons-material/Pinterest";
import PlaceIcon from "@mui/icons-material/Place";
import TwitterIcon from "@mui/icons-material/Twitter";

import Posts from "../../components/posts/posts";
import Spinner from "../../components/spinner/spinner";
import { axiosRequest } from "../../utils/axios.utils";
import "./profile.scss";
import { USER_TYPES } from "./profile.types";

const Profile = () => {
    const { id } = useParams();

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

    return (
        <div className="profile">
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
                        <button className="follow-button">
                            <PersonAddAlt1Icon fontSize="small" />
                            Follow
                        </button>
                    </div>

                    <div className="right">
                        <div className="more">
                            <EmailOutlinedIcon />
                            <MoreVertIcon />
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
