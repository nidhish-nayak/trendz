import { useContext, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import Spinner from "../spinner/spinner";
import "./addComment.scss";
import { NEW_COMMENT_TYPES } from "./addComment.types";

const AddComment = ({ postId }: { postId: number }) => {
	const queryClient = useQueryClient();
	const { currentUser } = useContext(AuthContext);

	const [comment, setComment] = useState("");
	const [uploading, setUploading] = useState(false);

	const mutation = useMutation({
		mutationFn: (newComment: NEW_COMMENT_TYPES) =>
			axiosRequest.post("/comments", newComment),
		onSuccess: () => {
			setComment("");

			queryClient.invalidateQueries({
				queryKey: ["comments"],
			});
			queryClient.invalidateQueries({
				queryKey: ["commentsCount"],
			});
			return setUploading(false);
		},
		onError(error) {
			setUploading(false);
			console.log(error);
			return alert("Comment upload failed!");
		},
	});

	if (!currentUser) return <div className="write">User not found!</div>;

	const submitComment = () => {
		if (comment === "") return alert("Please enter any comment!");
		setUploading(true);

		mutation.mutate({
			desc: comment,
			userId: currentUser.id,
			postId: postId,
		});
	};

	return (
		<div className="write">
			<img src={currentUser.profilePic} alt="user-img" />
			<input
				type="text"
				value={comment}
				placeholder="write a comment"
				onChange={(e) => setComment(e.target.value)}
			/>
			<div>
				{uploading ? (
					<Spinner />
				) : (
					<button onClick={submitComment}>Send</button>
				)}
			</div>
		</div>
	);
};

export default AddComment;
