import Activity from "./activity/activity";
import "./rightbar.scss";
import Suggested from "./suggested/suggested";

const Rightbar = () => {
    return (
        <div className="rightbar">
            <div className="container">
                <Suggested />
                <Activity />
                <div className="item">
                    <div className="item-container">
                        <div className="item-title-realtime">
                            Online Friends
                        </div>
                        <div
                            className="item-realtime"
                            title="Realtime updates cause heavy load on servers. Default state is set to disabled."
                        >
                            <p className="realtime-title">Realtime</p>
                            <div className="realtime-circle" />
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img
                                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="user-image"
                            />
                            <div className="online" />
                            <span>Jane Doe</span>
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img
                                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="user-image"
                            />
                            <div className="online" />
                            <span>Jane Doe</span>
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img
                                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="user-image"
                            />
                            <div className="online" />
                            <span>Jane Doe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;
