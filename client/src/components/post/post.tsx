import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";

import Delete from "@mui/icons-material/Delete";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import formatTime from "../../utils/date.utils";
import Comments from "../comments/comments";
import WebShare from "../share/web/webShare";
import Spinner from "../spinner/spinner";
import "./post.scss";
import { LikedPost, PostTypes } from "./post.types";

const Post = ({ post }: PostTypes) => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) throw Error("User not logged in!");
    if (!post) throw Error("Post is not rendered yet!");

    const [isOpen, setIsOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);

    const { profilePic, userId, name, img, desc, createdAt, id } = post;
    const time = formatTime(createdAt);

    // Handle post delete
    const mutation = useMutation({
        mutationFn: (id: number) => axiosRequest.delete(`posts/${id}`),
        onSuccess: () => {
            setIsOpen(false);
            queryClient.invalidateQueries({
                queryKey: ["posts", userId],
            });
        },
        onError(error) {
            console.log(error);
            return alert("Post deletion failed!");
        },
    });

    const handleDelete = () => {
        if (currentUser.id !== userId) return;
        return mutation.mutate(id);
    };

    // Get Comments
    const getCommentsCount = async () => {
        const res = await axiosRequest.get(`/comments/count?postId=${id}`);
        return res.data;
    };

    const {
        isLoading: commentsLoading,
        data: count,
        error: commentsError,
    } = useQuery({
        queryKey: ["commentsCount", id],
        queryFn: getCommentsCount,
    });

    if (commentsError) throw Error("getCommentsCount failed!");

    // Get Likes
    const getLikes = async () => {
        if (!id) return;
        const res = await axiosRequest.get(
            `likes?postId=${id}&userId=${currentUser.id}`
        );
        if (res.data) setIsLiked(res.data.liked);
        return res.data;
    };

    const {
        isLoading: likesLoading,
        data: likesData,
        error: likesError,
    } = useQuery({
        queryKey: ["likes", id],
        queryFn: getLikes,
    });

    if (likesError) throw Error("getLikes failed!");

    // Like Post
    const likeMutation = useMutation({
        mutationFn: (likedPost: LikedPost) =>
            axiosRequest.post("/likes", likedPost),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ["likes", id] });
        },
        onError(error) {
            console.log(error);
            return alert("Like upload failed!");
        },
    });

    // Dislike Post
    const dislikeMutation = useMutation({
        mutationFn: () => axiosRequest.delete(`likes/${id}`),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ["likes", id] });
        },
        onError(error) {
            console.log(error);
            return alert("Dislike failed!");
        },
    });

    const handleLike = () => {
        likeMutation.mutate({ postId: id, userId: currentUser.id });
    };

    const handleDislike = () => {
        dislikeMutation.mutate();
    };

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

    return (
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
                                <div className="delete" onClick={handleDelete}>
                                    <Delete fontSize="small" />
                                    Delete
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="content">
                    {img ? <img src={img} alt="post-image" /> : <p>{desc}</p>}
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
                        <div className="item" onClick={() => setIsLiked(true)}>
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
                        <WebShare post={post} />
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
                        `View all ${count} comments`
                    )}
                    {commentOpen ? <span>-</span> : <span>+</span>}
                </div>

                {commentOpen && <Comments postId={id} />}

                <div className="time-stamp">
                    <span className="stamps">{time}</span>
                    <span className="dot" />
                    <span className="stamps">Suggested for you</span>
                </div>
            </div>
        </div>
    );
};

export default Post;
