import { Fragment, useContext } from "react";
import { AuthContext } from "../../context/authContext";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../../utils/axios.utils";
import "./stories.scss";
import { GET_STORIES_TYPE } from "./stories.types";

const Stories = () => {
    const { currentUser } = useContext(AuthContext);
    const { profilePic } = currentUser!;

    const moveLeft = () => {
        document
            .getElementById("scrollStories")
            ?.scrollBy({ left: -300, behavior: "smooth" });
    };

    const moveRight = () => {
        document
            .getElementById("scrollStories")
            ?.scrollBy({ left: 300, behavior: "smooth" });
    };

    const getStories = async (): Promise<GET_STORIES_TYPE> => {
        const res = await axiosRequest.get("/stories");
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["stories"],
        queryFn: getStories,
    });

    if (isLoading) {
        return <div className="story-container"></div>;
    }

    if (error || !data) throw Error("get_stories fetch failed from server!");
    const stories = data;
    return (
        <Fragment>
            <div className="story-container">
                <ArrowBackIos
                    className="less-than"
                    onClick={moveLeft}
                    fontSize="small"
                />
                <div className="stories" id="scrollStories">
                    <div className="story">
                        <div className="module-border-wrap">
                            <img src={profilePic} alt="user-image" />
                            <div className="user-name">Your story</div>
                            <button>
                                <AddIcon fontSize="small" />
                            </button>
                        </div>
                    </div>
                    {stories.map((story) => (
                        <div className="story" key={story.id}>
                            <div className="module-border-wrap">
                                <img src={story.img} alt="user-story" />
                                <span className="user-name" title={story.name}>
                                    {story.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <ArrowForwardIos
                    className="greater-than"
                    onClick={moveRight}
                    fontSize="small"
                />
            </div>
            <hr className="separater" />
        </Fragment>
    );
};

export default Stories;
