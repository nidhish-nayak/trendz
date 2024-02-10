import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import Delete from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { axiosRequest } from "../../utils/axios.utils";
import formatTime from "../../utils/date.utils";
import "./comment.scss";
import { CommentTypes } from "./comment.types";

const Comment = ({ comment }: CommentTypes) => {
    const { id, profilePic, name, createdAt, desc } = comment;
    const time = formatTime(createdAt);
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: () => axiosRequest.delete(`comments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments"],
            });
            return setIsOpen(false);
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
                        <div
                            className="comment-delete"
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
                </div>
                <p className="comment-desc">{desc}</p>
            </div>
        </div>
    );
};

export default Comment;
