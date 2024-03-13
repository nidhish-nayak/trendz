import "../rightbar.scss";

const Online = () => {
    return (
        <div className="item">
            <div className="item-container">
                <div className="item-title-realtime">Online Friends</div>
                <div
                    className="item-realtime"
                    title="Show your online status to others - Heavy server load!"
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
    );
};

export default Online;
