import "../rightbar.scss";

const Activity = () => {
    return (
        <div className="item">
            <span>Latest Activities</span>
            <div className="user">
                <div className="userInfo">
                    <img
                        src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="user-image"
                    />
                    <div className="activity-container">
                        <div>
                            <span className="user-name" title="username">
                                Keerthanajand Manjunathan Nayak
                            </span>
                            <p className="user-time">1 min ago</p>
                        </div>
                        <p className="user-activity">
                            changed their cover picture
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;
