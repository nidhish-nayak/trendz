import Activity from "../activity/activity";
import Online from "../online/online";
import "./mobileRightbar.scss";

const MobileRightbar = () => {
    return (
        <div className="mobile-rightbar">
            <div className="container">
                <Activity />
                <Online />
            </div>
        </div>
    );
};

export default MobileRightbar;
