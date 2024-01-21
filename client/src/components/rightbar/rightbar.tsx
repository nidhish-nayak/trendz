import "./rightbar.scss";

const Rightbar = () => {
    return (
        <div className="rightbar">
            <div className="container">
                <div className="item">
                    <span>Suggestions For You</span>
                    <div className="user">
                        <div className="userInfo">
                            <img
                                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="user-image"
                            />
                            <span title="username">Jane Doe</span>
                        </div>
                        <div className="buttons">
                            <button>follow</button>
                            <button>dismiss</button>
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img
                                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="user-image"
                            />
                            <span title="username">Nidhishsadd Nayakasdad</span>
                        </div>
                        <div className="buttons">
                            <button>follow</button>
                            <button>dismiss</button>
                        </div>
                    </div>
                </div>
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
                                    <span
                                        className="user-name"
                                        title="username"
                                    >
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
                    <div className="user">
                        <div className="userInfo">
                            <img
                                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="user-image"
                            />
                            <div className="activity-container">
                                <div>
                                    <span className="user-name">Jane Doe</span>
                                    <p className="user-time">1 min ago</p>
                                </div>
                                <p className="user-activity">
                                    changed their cover picture
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <span>Online Friends</span>
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
