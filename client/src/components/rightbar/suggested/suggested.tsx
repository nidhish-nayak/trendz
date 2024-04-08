import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Refresh } from "@mui/icons-material";
import { AuthContext } from "../../../context/authContext";
import { FOLLOW_MUTATION_TYPE } from "../../../pages/profile/profile.types";
import { axiosRequest } from "../../../utils/axios.utils";
import Spinner from "../../spinner/spinner";
import "../rightbar.scss";
import { SUGGESTED_DATA_TYPES } from "./suggested.types";

const Suggested = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    const [isSpin, setIsSpin] = useState(false);

    if (!currentUser) throw Error("User not found!");

    // Mutate Followers Data
    const followMutation = useMutation({
        mutationFn: (followDetails: FOLLOW_MUTATION_TYPE) =>
            axiosRequest.post("/relationships", followDetails),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["relationships"],
            });
            queryClient.invalidateQueries({
                queryKey: ["users", currentUser.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["suggested"],
            });
            return setIsSpin(false);
        },
        onError(error) {
            setIsSpin(false);
            console.log(error);
            return alert("Follow user failed!");
        },
    });

    const handleFollow = (peopleId: number) => {
        setIsSpin(true);
        const followDetails = {
            followerUserId: currentUser.id,
            followedUserId: peopleId,
        };

        followMutation.mutate(followDetails);
    };

    // FILTER SUGGESTED DATA
    const filterSuggested = (data: SUGGESTED_DATA_TYPES) => {
        if (data.length <= 2) {
            return data;
        } else {
            // Shuffle the array to return random
            const shuffledData = [...data].sort(() => Math.random() - 0.5);
            // Return the first two elements
            return shuffledData.slice(0, 2);
        }
    };

    // GET SUGGESTED
    const getSuggestions = async (): Promise<SUGGESTED_DATA_TYPES> => {
        const res = await axiosRequest.get("/friends/findPeople");
        if (res.data) setIsSpin(false);
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["suggested"],
        queryFn: getSuggestions,
    });

    if (error) return <div className="item">Error - Data fetch failed!</div>;

    const handleRefresh = () => {
        queryClient.invalidateQueries({
            queryKey: ["suggested"],
        });

        return setIsSpin(true);
    };

    if (isLoading || !data || isSpin)
        return (
            <div className="item" style={{ paddingBottom: "20px" }}>
                <div className="item-title" style={{ marginBottom: "20px" }}>
                    <span>Suggestions For You</span>
                    <span onClick={handleRefresh}>
                        <Refresh fontSize="small" />
                    </span>
                </div>
                <Spinner />
            </div>
        );

    if (!isLoading && data) {
        const filteredData = filterSuggested(data);

        return (
            <div className="item">
                <div className="item-title">
                    <span>Suggestions For You</span>
                    <span onClick={handleRefresh}>
                        <Refresh fontSize="small" />
                    </span>
                </div>
                {filteredData.map((user) => (
                    <div className="user" key={user.id}>
                        <div className="userInfo">
                            <img src={user.profilePic} alt="user-image" />
                            <div className="username-wrapper">
                                <span className="name" title={user.name}>
                                    <Link
                                        to={`/profile/${user.id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        {user.name}
                                    </Link>
                                </span>
                                <span
                                    className="username"
                                    title={user.username}
                                >
                                    {user.username}
                                </span>
                            </div>
                        </div>
                        <div
                            className="buttons"
                            onClick={() => handleFollow(user.id)}
                        >
                            <button>Follow</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default Suggested;
