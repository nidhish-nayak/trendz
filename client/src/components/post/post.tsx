import { useState } from "react";
import { Link } from "react-router-dom";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";

import Comments from "../comments/comments";
import "./post.scss";
import { PostTypes } from "./post.types";

const Post = ({ post }: PostTypes) => {
    const [commentOpen, setCommentOpen] = useState(false);

    //TEMPORARY
    const liked = false;

    return (
        <div className="post">
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={post.profilePic} alt="" />
                        <div className="details">
                            <Link
                                to={`/profile/${post.userId}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <span className="name">{post.name}</span>
                            </Link>
                            <span className="date">1 min ago</span>
                        </div>
                    </div>
                    <MoreHorizIcon className="more-icon" />
                </div>
                <div className="content">
                    {post.img ? (
                        <img src={post.img} alt="post-image" />
                    ) : (
                        <p>{post.desc}</p>
                    )}
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
                {post.img ? (
                    <p>
                        <span>{post.name}</span>
                        {post.desc}
                    </p>
                ) : (
                    <></>
                )}

                {commentOpen && <Comments />}
                <div
                    className="comment-stamp"
                    onClick={() => setCommentOpen(!commentOpen)}
                >
                    {commentOpen ? "" : "View all 12 comments"}
                </div>
                <div className="time-stamp">
                    <span className="stamps">1 min ago</span>
                    <span className="dot" />
                    <span className="stamps">Suggested for you</span>
                </div>
            </div>
        </div>
    );
};

export default Post;
