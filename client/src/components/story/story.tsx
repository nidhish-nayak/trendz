import { Close } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { GET_STORIES_TYPE } from "../stories/stories.types";
import "./story.scss";
import { STORY_TYPE } from "./story.types";

const Story = ({
    closeStory,
    allStories,
    storyData,
}: {
    closeStory: () => void;
    allStories: GET_STORIES_TYPE;
    storyData: STORY_TYPE;
}) => {
    const { currentUser } = useContext(AuthContext);
    if (!currentUser) throw Error("User not found!");

    const [count, setCount] = useState(0);

    const handleStoryDelete = (imgUrl: string) => {
        if (currentUser.id !== storyData.userId)
            return alert("User unauthorized");

        const filteredStory = allStories.filter(
            (story) => story.userId === currentUser.id && story.img === imgUrl
        );

        if (!filteredStory || filteredStory.length !== 1) {
            return alert(
                "Error - filter story failed for delete! Please retry"
            );
        }

        const storyToBeDeleted = filteredStory[0];
    };

    return (
        <div className="story-view-container">
            <div className="story-view-wrapper">
                <div
                    className="back"
                    onClick={() => {
                        if (count === 0) {
                            return setCount(storyData.img.length - 1);
                        }
                        return setCount(count - 1);
                    }}
                />
                <div
                    className="next"
                    onClick={() => {
                        if (count >= storyData.img.length - 1) {
                            return setCount(0);
                        }
                        return setCount(count + 1);
                    }}
                />
                <div className="story-view-header">
                    <p className="story-view-title">
                        <span>{storyData.name}</span>'s story
                    </p>
                    {currentUser.id === storyData.userId ? (
                        <div
                            className="story-view-delete"
                            onClick={() =>
                                handleStoryDelete(storyData.img[count])
                            }
                        >
                            <DeleteForeverIcon />
                        </div>
                    ) : null}
                </div>
                <div className="story-view-data">
                    {storyData.img
                        .filter((_image, index) => count === index)
                        .map((image, index) => {
                            return (
                                <div
                                    className="story-image-container"
                                    key={index}
                                >
                                    <img
                                        src={image}
                                        alt="story-image"
                                        className="story-view-image"
                                    />
                                </div>
                            );
                        })}
                </div>
                <button
                    className="story-view-close"
                    onClick={() => closeStory()}
                >
                    <Close />
                </button>
            </div>
        </div>
    );
};

export default Story;
