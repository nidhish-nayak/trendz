import { Fragment, useContext } from "react";
import { AuthContext } from "../../context/authContext";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import "./stories.scss";

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

    //TEMPORARY
    const stories = [
        {
            id: 1,
            name: "Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 2,
            name: "John Doeeeeeeeeeeeee",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 3,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 4,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 5,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 6,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
        {
            id: 7,
            name: "John Doe",
            img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        },
    ];

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
