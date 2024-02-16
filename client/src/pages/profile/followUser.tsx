import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "./profile.scss";
import { FOLLOW_TYPE } from "./profile.types";

const FollowUser = () => {
    const { id } = useParams();
    const [isFollowed, setIsFollowed] = useState(false);
    const { currentUser } = useContext(AuthContext);

    // Get Followers Data
    const getFollowers = async () => {
        const res = await axiosRequest.get(`/relationships/${id}`);
        if (res.data.length === 0) setIsFollowed(false);
        else setIsFollowed(true);
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["relationships"],
        queryFn: getFollowers,
    });

    if (error) throw Error("getFollowers fetch failed!");

    // Follow user
    const handleFollow = () => {
        return;
    };

    // Unfollow User
    const handleUnfollow = () => {
        return;
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (currentUser!.id === parseInt(id!)) {
        const followerCount: FOLLOW_TYPE[] = data;
        return (
            <button className="follow-button">
                {followerCount.length} Followers
            </button>
        );
    }

    if (!isLoading && data) {
        return (
            <>
                {isFollowed ? (
                    <button
                        className="follow-button"
                        style={{ backgroundColor: "crimson" }}
                        onClick={handleUnfollow}
                    >
                        <PersonRemoveAlt1Icon fontSize="small" />
                        Unfollow
                    </button>
                ) : (
                    <button className="follow-button" onClick={handleFollow}>
                        <PersonAddAlt1Icon fontSize="small" />
                        Follow
                    </button>
                )}
            </>
        );
    }
};

export default FollowUser;
