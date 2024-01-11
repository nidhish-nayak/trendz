import { useContext } from "react";
import Friends from "../../assets/1.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import { AuthContext } from "../../context/authContext";
import "./leftbar.scss";

const Leftbar = () => {
    const { currentUser } = useContext(AuthContext);
    const { name, profilePic } = currentUser!;

    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <div className="user">
                        <img src={profilePic} alt="user-image" />
                        <span>{name ? name : "No User!"}</span>
                    </div>
                    <div className="item">
                        <img src={Friends} alt="user-items" />
                        <span>Friends</span>
                    </div>
                    <div className="item">
                        <img src={Groups} alt="user-items" />
                        <span>Groups</span>
                    </div>
                    <div className="item">
                        <img src={Market} alt="user-items" />
                        <span>Marketplace</span>
                    </div>
                    <div className="item">
                        <img src={Watch} alt="user-items" />
                        <span>Watch</span>
                    </div>
                    <div className="item">
                        <img src={Memories} alt="user-items" />
                        <span>Memories</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span>Your shortcuts</span>
                    <div className="item">
                        <img src={Events} alt="shortcut-items" />
                        <span>Events</span>
                    </div>
                    <div className="item">
                        <img src={Gaming} alt="shortcut-items" />
                        <span>Gaming</span>
                    </div>
                    <div className="item">
                        <img src={Gallery} alt="shortcut-items" />
                        <span>Gallery</span>
                    </div>
                    <div className="item">
                        <img src={Videos} alt="shortcut-items" />
                        <span>Videos</span>
                    </div>
                    <div className="item">
                        <img src={Messages} alt="shortcut-items" />
                        <span>Messages</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span>Others</span>
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
