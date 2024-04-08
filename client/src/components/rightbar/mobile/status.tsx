import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import "../rightbar.scss";

const Status = () => {
    const { currentUser } = useContext(AuthContext);
    if (!currentUser) throw Error("User not found!");

    const { username } = currentUser;
    return (
        <div className="item note">
            <div className="item-container mobile">
                <div className="item-title-realtime note">
                    <div className="item-title-data username">Access</div>
                </div>
                <div className="item-realtime">
                    <p className="realtime-title">
                        {username === "guest" ? "Read Only" : "Full Access"}
                    </p>
                    <div
                        className={`realtime-circle ${username === "guest" ? "read-only" : "online"}`}
                    />
                </div>
            </div>
            <div className="item-container mobile access">
                <div className="username">Username:</div>
                <div className="value">{username}</div>
            </div>
            <div className="item-container mobile note">
                <span>Note:</span>
                {username === "guest"
                    ? "Guest user is read-only mode. Please sign-up to access all features."
                    : "You have access to all features!"}
            </div>
        </div>
    );
};

export default Status;
