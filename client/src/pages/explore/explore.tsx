import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import { axiosRequest } from "../../utils/axios.utils";
import formatTime from "../../utils/date.utils";
import "./explore.scss";
import { EXPLORE_DATA_TYPES } from "./explore.types";

const Explore = () => {
    const navigate = useNavigate();

    // GET EXPLORE DATA
    const getExplore = async (): Promise<EXPLORE_DATA_TYPES> => {
        const res = await axiosRequest.get("/posts/explore");
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["explore"],
        queryFn: getExplore,
    });

    if (error)
        return <div className="explore-container">Explore fetch failed!</div>;

    if (isLoading || !data)
        return (
            <div className="explore-container">
                <div className="explore">
                    <Spinner />
                </div>
            </div>
        );

    if (data) {
        return (
            <div className="explore-container">
                <div className="explore">
                    {data.map((post) => (
                        <div
                            className="explore-post"
                            key={post.id}
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            <h4>{post.name}</h4>
                            <img
                                src={post.img}
                                alt="post-image"
                                className="explore-post-image"
                            />
                            <p>{formatTime(post.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default Explore;
