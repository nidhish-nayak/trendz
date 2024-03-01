import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { PostContext } from "../../context/postContext";
import "./leftbar.scss";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExploreIcon from "@mui/icons-material/Explore";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";

const Leftbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { isPostOpen, setIsPostOpen } = useContext(PostContext);

    if (!currentUser) throw Error("User not logged in!");
    const { id, profilePic } = currentUser;

    const handlePostOpen = () => {
        navigate("/");
        return setIsPostOpen();
    };

    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <Link
                        to={`/profile/${id}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <div className="item">
                            <img src={profilePic} alt="user-image" />
                            <span style={{ fontWeight: "500" }}>Profile</span>
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
                            <Diversity3Icon />
                            <span>Friends</span>
                        </div>
                    </Link>
                    <div className="item">
                        <MarkEmailReadOutlinedIcon />
                        <span>Notifications</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span className="menu-heading">Explore</span>
                    <div className="item">
                        <ExploreIcon />
                        <span>Explore</span>
                    </div>
                    <div
                        className={isPostOpen ? `item active` : "item"}
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
                    <div className="item">
                        <PersonSearchOutlinedIcon />
                        <span>Find People</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span className="menu-heading">Others</span>
                    <div className="item">
                        <img src={Fund} alt="other-items" />
                        <span>Fundraiser</span>
                    </div>
                    <div className="item">
                        <img src={Tutorials} alt="other-items" />
                        <span>Tutorials</span>
                    </div>
                    <div className="item">
                        <img src={Courses} alt="other-items" />
                        <span>Courses</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leftbar;
