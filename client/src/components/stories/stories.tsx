import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, Fragment, useContext, useState } from "react";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import config from "../../config/config";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import upload from "../../utils/upload.utils";
import Spinner from "../spinner/spinner";
import Story from "../story/story";
import { STORY_TYPE } from "../story/story.types";
import "./stories.scss";
import { GET_STORIES_TYPE } from "./stories.types";
import { GROUPED_STORIES_TYPE, formatStories } from "./stories.util";

const Stories = () => {
    const { currentUser } = useContext(AuthContext);
    const queryClient = useQueryClient();
    if (!currentUser) throw Error("User not found!");

    const [isPostOpen, setIsPostOpen] = useState(false);
    const [localStory, setLocalStory] = useState<string | null>(null);
    const [storyImg, setStoryImg] = useState<File | null>(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [storyData, setStoryData] = useState<STORY_TYPE | null>(null);

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

    // Open & Close story
    const handleStory = (story: STORY_TYPE) => {
        setIsStoryOpen(!isStoryOpen);
        setStoryData(story);
        return;
    };

    // GET STORIES
    const getStories = async (): Promise<GET_STORIES_TYPE> => {
        const res = await axiosRequest.get("/stories");
        return res.data;
    };

    const {
        isLoading: getStoryLoading,
        data: getStoryData,
        error: getStoryError,
    } = useQuery({
        queryKey: ["stories"],
        queryFn: getStories,
    });

    // POST STORY
    const mutation = useMutation({
        mutationFn: (img: string) =>
            axiosRequest.post("/stories", { img: img }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stories"] });
            setIsSubmitLoading(false);
            setLocalStory(null);
            setStoryImg(null);
            setIsPostOpen(false);
        },
        onError(error) {
            setIsSubmitLoading(false);
            console.log(error);
            return alert("Story upload failed!");
        },
    });

    const handlePostClick = () => {
        setIsPostOpen(!isPostOpen);
    };

    const handlePostSubmit = async () => {
        if (!storyImg || storyImg === null) return alert("No image uploaded!");
        setIsSubmitLoading(true);

        const storyImgUrl = await upload(storyImg, config.s3.folders.stories);
        if (!storyImgUrl) {
            setIsSubmitLoading(false);
            return;
        }
        mutation.mutate(storyImgUrl);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        if (file && file.size > 5242880) {
            return alert("Please upload image less than 5MB!");
        }
        const imgUrl = URL.createObjectURL(file);
        setLocalStory(imgUrl);
        setStoryImg(file);
    };

    if (getStoryLoading) {
        return <div className="story-container"></div>;
    }

    if (getStoryError || !getStoryData)
        throw Error("get_stories fetch failed from server!");

    const { profilePic } = currentUser;
    const unformattedStories: GET_STORIES_TYPE = getStoryData;
    const formattedStories: GROUPED_STORIES_TYPE = formatStories(getStoryData);

    return (
        <Fragment>
            <div className="story-container">
                <ArrowBackIos
                    className="less-than"
                    onClick={moveLeft}
                    fontSize="small"
                />
                <div className="stories" id="scrollStories">
                    {isPostOpen ? (
                        <div className="story-upload">
                            <div className="story-upload-header">
                                <h2 className="story-upload-title">
                                    Upload Story
                                </h2>
                                <div
                                    className="story-upload-close"
                                    onClick={handlePostClick}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className="story-upload-container">
                                <div className="image-wrapper">
                                    {localStory ? (
                                        <img
                                            className="story-upload-image"
                                            src={localStory}
                                            alt="local-image"
                                        />
                                    ) : null}
                                    <input
                                        type="file"
                                        id="file"
                                        className="story-upload-image"
                                        name="file`"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file">
                                        <div className="image-upload-icon">
                                            <AddPhotoAlternateIcon fontSize="large" />
                                        </div>
                                    </label>
                                </div>
                                <button
                                    className="story-upload-button"
                                    onClick={handlePostSubmit}
                                >
                                    {isSubmitLoading ? (
                                        <Spinner />
                                    ) : (
                                        "Submit Story"
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : null}
                    <div className="story">
                        <div
                            className="module-border-wrap"
                            onClick={handlePostClick}
                        >
                            <img src={profilePic} alt="user-image" />
                            <div className="user-name">Add story</div>
                            <button onClick={handlePostClick}>
                                <AddIcon fontSize="small" />
                            </button>
                        </div>
                    </div>
                    {formattedStories.map((story) => (
                        <div className="story" key={story.userId}>
                            <div
                                className="module-border-wrap"
                                onClick={() => handleStory(story)}
                            >
                                <img src={story.img[0]} alt="user-story" />
                                <span className="user-name" title={story.name}>
                                    {story.name}
                                </span>
                                <div className="count-story">
                                    {story.img.map((_count, index) => (
                                        <div className="bar" key={index} />
                                    ))}
                                </div>
                            </div>
                            {isStoryOpen && storyData ? (
                                <Story
                                    closeStory={() => setIsStoryOpen(false)}
                                    allStories={unformattedStories}
                                    storyData={storyData}
                                />
                            ) : null}
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
