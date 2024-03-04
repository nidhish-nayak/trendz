import { Refresh } from "@mui/icons-material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../../utils/axios.utils";
import Spinner from "../../spinner/spinner";
import "../rightbar.scss";
import { SUGGESTED_DATA_TYPES } from "./suggested.types";

const Suggested = () => {
    const queryClient = useQueryClient();
    const [isSpin, setIsSpin] = useState(false);

    const handleRefresh = () => {
        queryClient.invalidateQueries({
            queryKey: ["suggested"],
        });
        return setIsSpin(true);
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
                        <div className="buttons">
                            <button>Follow</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default Suggested;
