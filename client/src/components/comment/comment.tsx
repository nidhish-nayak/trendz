import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

import Delete from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import formatTime from "../../utils/date.utils";
import "./comment.scss";
import { CommentTypes } from "./comment.types";

const Comment = ({ comment }: CommentTypes) => {
	const postId = useParams();
	const { id, profilePic, name, createdAt, desc, userId } = comment;
	const [isOpen, setIsOpen] = useState(false);

	const queryClient = useQueryClient();
	const { currentUser } = useContext(AuthContext);

	const time = formatTime(createdAt);

	useEffect(() => {
		setIsOpen(false);
	}, [postId]);

	const mutation = useMutation({
		mutationFn: () => axiosRequest.delete(`comments/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["comments"],
			});
			return setIsOpen(false);
		},
		onError(error) {
			console.log(error);
			return alert("Comment deletion failed!");
		},
	});

	const handleDelete = () => {
		mutation.mutate();
	};

	return (
		<div className="comment">
			<img src={profilePic} alt="comment-img" />
			<div className="comment-info">
				<div className="comment-user">
					<div className="comment-name">{name}</div>
					<div className="delete-container">
						<div className="comment-date">{time}</div>
						{currentUser?.id === userId && (
							<div
								className="comment-delete"
								onClick={() => setIsOpen(!isOpen)}
							>
								<MoreVertIcon />
								{isOpen && (
									<div
										className="delete"
										onClick={handleDelete}
									>
										<Delete fontSize="small" />
										Delete
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<p className="comment-desc">{desc}</p>
			</div>
		</div>
	);
};

export default Comment;
