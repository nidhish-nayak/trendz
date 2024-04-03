import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Delete from "@mui/icons-material/Delete";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";

import { ArrowBackIosNew } from "@mui/icons-material";
import Comments from "../../../components/comments/comments";
import { LikedPost } from "../../../components/post/post.types";
import WebShare from "../../../components/share/web/webShare";
import Spinner from "../../../components/spinner/spinner";
import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import formatTime from "../../../utils/date.utils";
import { EXPLORE_DATA_TYPES } from "../explore.types";
import "./singlePost.scss";

const SinglePost = () => {
	const { postId } = useParams();
	const queryClient = useQueryClient();
	const { currentUser } = useContext(AuthContext);

	if (!postId) throw Error("PostID not found!");

	// Redeclaring since useParams values can't be mutated
	const postIdString = postId;
	const post_id = parseInt(postIdString);

	if (!currentUser) throw Error("User not logged in!");

	const [isOpen, setIsOpen] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [commentOpen, setCommentOpen] = useState(false);

	// Like Post
	const likeMutation = useMutation({
		mutationFn: (likedPost: LikedPost) =>
			axiosRequest.post("/likes", likedPost),
		onSuccess: () => {
			return queryClient.invalidateQueries({
				queryKey: ["likes", post_id],
			});
		},
		onError(error) {
			console.log(error);
			return alert("Like upload failed!");
		},
	});

	// Dislike Post
	const dislikeMutation = useMutation({
		mutationFn: () => axiosRequest.delete(`likes/${post_id}`),
		onSuccess: () => {
			return queryClient.invalidateQueries({
				queryKey: ["likes", post_id],
			});
		},
		onError(error) {
			console.log(error);
			return alert("Dislike failed!");
		},
	});

	// Handle post delete
	const mutation = useMutation({
		mutationFn: (post_id: number) =>
			axiosRequest.delete(`posts/${post_id}`),
		onSuccess: () => {
			setIsOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["posts"],
			});
		},
		onError(error) {
			console.log(error);
			return alert("Post deletion failed!");
		},
	});

	// GET POST DATA
	const getSinglePost = async (): Promise<EXPLORE_DATA_TYPES> => {
		const res = await axiosRequest.get(`/posts/${post_id}`);
		return res.data;
	};

	const {
		isLoading: isPostLoading,
		data: postData,
		error: postError,
	} = useQuery({
		queryKey: ["singlePost", post_id],
		queryFn: getSinglePost,
	});

	// Get Comments
	const getCommentsCount = async () => {
		const res = await axiosRequest.get(`/comments/count?postId=${post_id}`);
		return res.data;
	};

	const {
		isLoading: commentsLoading,
		data: count,
		error: commentsError,
	} = useQuery({
		queryKey: ["commentsCount", post_id],
		queryFn: getCommentsCount,
	});

	// Get Likes
	const getLikes = async () => {
		if (!post_id) return;
		const res = await axiosRequest.get(
			`likes?postId=${post_id}&userId=${currentUser.id}`
		);
		if (res.data) setIsLiked(res.data.liked);
		return res.data;
	};

	const {
		isLoading: likesLoading,
		data: likesData,
		error: likesError,
	} = useQuery({
		queryKey: ["likes", post_id],
		queryFn: getLikes,
	});

	// Debouncing Likes to avoid spam
	useEffect(() => {
		if (likesLoading) return;
		if (likesData.liked === isLiked) return;

		const debounce = setTimeout(() => {
			isLiked ? handleLike() : handleDislike();
		}, 5000);
		return () => clearTimeout(debounce);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLiked, likesLoading]);

	if (postError) throw Error("singlePost fetch failed!");
	if (commentsError) throw Error("getCommentsCount failed!");
	if (likesError) throw Error("getLikes failed!");

	if (!postData || isPostLoading) return <Spinner />;

	const { userId, profilePic, name, img, desc, createdAt } = postData[0];
	const time = formatTime(createdAt);

	// HANDLERS
	const handleDelete = () => {
		if (currentUser.id !== userId) return;
		return mutation.mutate(post_id);
	};

	const handleLike = () => {
		likeMutation.mutate({ postId: post_id, userId: currentUser.id });
	};

	const handleDislike = () => {
		dislikeMutation.mutate();
	};

	return (
		<div className="single-post">
			<button className="single-post-back" onClick={() => history.back()}>
				<ArrowBackIosNew fontSize="small" /> Back
			</button>
			<div className="post">
				<div className="container">
					<div className="user">
						<div className="userInfo">
							<Link to={`/profile/${userId}`}>
								<img src={profilePic} alt="user-image" />
							</Link>
							<div className="details">
								<Link
									to={`/profile/${userId}`}
									style={{
										textDecoration: "none",
										color: "inherit",
									}}
								>
									<div
										className="name"
										style={{
											maxWidth: "150px",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{name}
									</div>
								</Link>
								<span className="date">{time}</span>
							</div>
						</div>
						{currentUser.id === userId && (
							<div
								className="post-delete"
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
					<div className="content">
						{img ? (
							<img src={img} alt="post-image" />
						) : (
							<p>{desc}</p>
						)}
					</div>
					<div className="info">
						{likesLoading ? (
							<div className="item" onClick={handleLike}>
								<FavoriteBorderOutlinedIcon />
							</div>
						) : isLiked === true ? (
							<div
								className="item"
								style={{ color: "crimson" }}
								onClick={() => setIsLiked(false)}
							>
								<FavoriteOutlinedIcon />
							</div>
						) : (
							<div
								className="item"
								onClick={() => setIsLiked(true)}
							>
								<FavoriteBorderOutlinedIcon />
							</div>
						)}
						<div
							className="item"
							onClick={() => setCommentOpen(!commentOpen)}
						>
							<TextsmsOutlinedIcon />
						</div>
						<div className="item">
							<WebShare post={postData[0]} />
						</div>
					</div>
					<span className="mobile-likes">
						{likesLoading ? <Spinner /> : likesData.count} Likes
					</span>
					{img && (
						<p>
							<span>{name}</span>
							{desc}
						</p>
					)}
					<div
						className="comment-stamp"
						onClick={() => setCommentOpen(!commentOpen)}
					>
						{commentsLoading ? (
							<Spinner />
						) : count === 0 ? (
							"No Comments"
						) : (
							`View all ${count ? count : "#"} comments`
						)}
						{commentOpen ? <span>-</span> : <span>+</span>}
					</div>

					{commentOpen && <Comments postId={post_id} />}

					<div className="time-stamp">
						<span className="stamps">{time}</span>
						<span className="dot" />
						<span className="stamps">Suggested for you</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SinglePost;
