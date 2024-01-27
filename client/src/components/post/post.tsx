import { useState } from "react";
import { Link } from "react-router-dom";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";

import formatTimeDifference from "../../utils/date.utils";
import Comments from "../comments/comments";
import "./post.scss";
import { PostTypes } from "./post.types";

const Post = ({ post }: PostTypes) => {
    const [commentOpen, setCommentOpen] = useState(false);
    const { profilePic, userId, name, img, desc, createdAt } = post;

    //TEMPORARY
    const liked = false;

    const currentDate = new Date().toISOString();
    const postedDate = createdAt;

    const currentDateObject = new Date(currentDate).getTime();
    const postedDateObject = new Date(postedDate).getTime();

    const timeDifference: number = currentDateObject - postedDateObject;
    const time = formatTimeDifference(timeDifference);

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
                    <MoreHorizIcon className="more-icon" />
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
                {post.img ? (
                    <p>
                        <span>{name}</span>
                        {desc}
                    </p>
                ) : (
                    <></>
                )}

                <div
                    className="comment-stamp"
                    onClick={() => setCommentOpen(!commentOpen)}
                >
                    View all 12 comments
                    {commentOpen ? <span>-</span> : <span>+</span>}
                </div>

                {commentOpen && <Comments />}

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
