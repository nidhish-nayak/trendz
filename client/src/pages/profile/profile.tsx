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

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Posts from "../../components/posts/posts";
import "./profile.scss";

const Profile = () => {
    const userId = useParams();
    console.log(userId);
    // const getUsers = () => {
    //     return axiosRequest.get(`/users/${userId}`)
    // }

    const { isLoading, data, error } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    return (
        <div className="profile">
            <div className="user-container">
                <div className="images">
                    <img
                        src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt=""
                        className="cover"
                    />
                    <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className="profilePic"
                    />
                </div>
                <div className="details">
                    <div className="left">
                        <div className="name">Jane Doe</div>
                        <div className="desc">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
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
                            <div className="item">
                                <PlaceIcon />
                                <span>USA</span>
                            </div>
                            <div className="item">
                                <LanguageIcon />
                                <span>lama.dev</span>
                            </div>
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
