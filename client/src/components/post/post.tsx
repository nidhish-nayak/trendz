import { useState } from "react";
import { Link } from "react-router-dom";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";

import Delete from "@mui/icons-material/Delete";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosRequest } from "../../utils/axios.utils";
import formatTime from "../../utils/date.utils";
import Comments from "../comments/comments";
import Spinner from "../spinner/spinner";
import "./post.scss";
import { PostTypes } from "./post.types";

const Post = ({ post }: PostTypes) => {
    const { profilePic, userId, name, img, desc, createdAt, id } = post;

    const [commentOpen, setCommentOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const time = formatTime(createdAt);

    const getCommentsCount = async () => {
        try {
            const res = await axiosRequest.get(`/comments/count?postId=${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            console.error(err);
            throw Error("Comments count fetch failed!");
        }
    };

    const {
        isLoading,
        data: count,
        error,
    } = useQuery({
        queryKey: ["comments", post],
        queryFn: getCommentsCount,
    });

    if (error) throw Error("getCommentsCount failed!");

    const handleDelete = () => {
        // Will be added last
        setIsOpen(false);
        return;
    };

    //TEMPORARY
    const liked = false;

    return (
        <div className="post">
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={profilePic} alt="" />
                        <div className="details">
                            <Link
                                to={`/profile/${userId}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <span className="name">{name}</span>
                            </Link>
                            <span className="date">{time}</span>
                        </div>
                    </div>
                    <div
                        className="post-delete"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <MoreVertIcon />
                        {isOpen && (
                            <div className="delete" onClick={handleDelete}>
                                Delete
                                <Delete />
                            </div>
                        )}
                    </div>
                </div>
                <div className="content">
                    {img ? <img src={img} alt="post-image" /> : <p>{desc}</p>}
                </div>
                <div className="info">
                    <div className="item">
                        {liked ? (
                            <FavoriteOutlinedIcon />
                        ) : (
                            <FavoriteBorderOutlinedIcon />
                        )}
                    </div>
                    <div
                        className="item"
                        onClick={() => setCommentOpen(!commentOpen)}
                    >
                        <TextsmsOutlinedIcon />
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                    </div>
                </div>
                <span className="mobile-likes">12 Likes</span>
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
                    {isLoading ? (
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
