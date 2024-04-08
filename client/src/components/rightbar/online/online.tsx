import { debounce } from "lodash";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../context/authContext";
import { OnlineContext } from "../../../context/onlineContext";
import useOnlineChannel from "../../../hooks/realtime/useOnlineChannel";
import { axiosRequest } from "../../../utils/axios.utils";
import "../rightbar.scss";
import { ONLINE_USERS } from "./online.types";

// User data realtime updates every 3 seconds
const Online = () => {
    const { onlineData, setIsOnline, isOnline } = useContext(OnlineContext);
    const { currentUser } = useContext(AuthContext);
    if (!currentUser) throw Error("User not found!");

    const { id, name, username, profilePic } = currentUser;
    const [userData, setUserData] = useState<ONLINE_USERS>([
        { id, name, username, profilePic },
    ]);

    // Send your userId to add your presence
    useOnlineChannel(currentUser.id);

    useEffect(() => {
        const getUsers = async () => {
            if (!onlineData) {
                const arrayId = [currentUser.id];
                const res = await axiosRequest.post(
                    "/users/onlineUsers",
                    arrayId
                );
                return res.data;
            }

            const array = onlineData.map((data) => data.user_id);
            const res = await axiosRequest.post("/users/onlineUsers", array);
            return res.data;
        };

        const fetchOnlineUsers = async () => {
            try {
                const users = await getUsers();
                setUserData(users);
            } catch (error) {
                console.error("Error fetching online users:", error);
            }
        };

        const debouncedFunc = debounce(fetchOnlineUsers, 3000);

        debouncedFunc();
    }, [currentUser.id, onlineData]);

    return (
        <div className="item">
            <div className="item-container">
                <div className="item-title-realtime">Online Friends</div>
                <div
                    className="item-realtime"
                    title="Show your online status to others - Heavy server load!"
                    onClick={() => setIsOnline(!isOnline)}
                >
                    <p className="realtime-title">Status</p>
                    <div
                        className={`realtime-circle ${!isOnline && "offline"}`}
                    />
                </div>
            </div>
            {!isOnline && (
                <div className="user offline">Realtime activities off</div>
            )}
            {isOnline && (
                <>
                    {userData.map((user) => {
                        return (
                            <div className="user" key={user.id}>
                                <div className="userInfo">
                                    <img
                                        src={user.profilePic}
                                        alt="user-image"
                                    />
                                    <div className="online" />
                                    <span>{user.name}</span>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default Online;
