import { Close } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import Spinner from "../spinner/spinner";
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
	const queryClient = useQueryClient();
	if (!currentUser) throw Error("User not found!");
	const [isLoading, setIsLoading] = useState(false);

	const [count, setCount] = useState(0);

	// Delete Story with ID
	const mutation = useMutation({
		mutationFn: (id: number) => axiosRequest.delete(`stories/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["stories"],
			});
			setIsLoading(false);
			return closeStory();
		},
		onError(error) {
			console.log(error);
			return alert("Story deletion failed!");
		},
	});

	const handleStoryDelete = (imgUrl: string) => {
		setIsLoading(true);
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
		if (!storyToBeDeleted.id) return alert("Story not found!");

		mutation.mutate(storyToBeDeleted.id);
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
							{isLoading ? <Spinner /> : <DeleteForeverIcon />}
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
