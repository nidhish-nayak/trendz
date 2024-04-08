import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useContext, useState } from "react";

import { HeartBrokenRounded, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import Followers from "./components/followers";
import Following from "./components/following";
import "./friends.scss";
import { FRIENDS_DATA_TYPES } from "./friends.types";

const Friends = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    const [inputData, setInputData] = useState("");

    if (!currentUser) throw Error("User not found!");

    // Search filter
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    const filterFriendsData = (friendsData: FRIENDS_DATA_TYPES) => {
        const data = friendsData.filter((friend) => {
            const searchText = inputData.toLowerCase();
            const name = friend.name.toLowerCase();
            const username = friend.username.toLowerCase();
            return name.includes(searchText) || username.includes(searchText);
        });

        return data;
    };

    // Get Friends Data
    const getFriends = async (): Promise<FRIENDS_DATA_TYPES> => {
        const res = await axiosRequest.get(`/friends`);
        return res.data;
    };

    const {
        isLoading: friendsLoading,
        data: friendsData,
        error: friendsError,
    } = useQuery({
        queryKey: ["relationships", currentUser.id],
        queryFn: getFriends,
    });

    if (friendsError) throw Error("getFriends fetch failed!");

    // Unfollow User
    const unfollowMutation = useMutation({
        mutationFn: (friendId: number) =>
            axiosRequest.delete(`/relationships/${friendId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["relationships", currentUser.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["suggested"],
            });
            queryClient.invalidateQueries({
                queryKey: ["following"],
            });
        },
        onError(error) {
            console.log(error);
            return alert("Unfollow user failed!");
        },
    });

    const handleUnfollow = (id: number) => {
        unfollowMutation.mutate(id);
    };

    if (friendsLoading || !friendsData) {
        return <Spinner />;
    }

    if (!friendsLoading && friendsData) {
        const friends = filterFriendsData(friendsData);

        return (
            <div className="friends-container">
                <div className="friends">
                    <h3 className="friends-title">
                        Friends <span>(people who follow you back)</span>
                    </h3>
                    <hr className="friends-divider" />
                    <div className="friends-search">
                        <div className="search-icon">
                            <Search fontSize="small" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="friends-list">
                        {friends.map((friend) => (
                            <div className="friend" key={friend.id}>
                                <div className="friend-data">
                                    <img
                                        src={friend.profilePic}
                                        alt="friend-image"
                                    />
                                    <div className="friend-detail">
                                        <span
                                            className="detail-name"
                                            title={friend.name}
                                        >
                                            <Link
                                                to={`/profile/${friend.id}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                {friend.name}
                                            </Link>
                                        </span>
                                        <span
                                            className="detail-username"
                                            title={friend.username}
                                        >
                                            {friend.username}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="friend-status"
                                    onClick={() => handleUnfollow(friend.id)}
                                >
                                    <div className="unfollow-icon">
                                        <HeartBrokenRounded />
                                    </div>
                                    <span className="unfollow-text">
                                        Following
                                    </span>
                                    <span className="unfollow-text-hover">
                                        Unfollow!
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Followers />
                <Following />
            </div>
        );
    }
};

export default Friends;
