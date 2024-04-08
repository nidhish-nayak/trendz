import { useQuery } from "@tanstack/react-query";

import { axiosRequest } from "../../utils/axios.utils";
import AddComment from "../addComment/addComment";
import Comment from "../comment/comment";
import Spinner from "../spinner/spinner";
import CommentsError from "./comments.error";
import "./comments.scss";
import { CommentsProps, CommentsTypes } from "./comments.types";

const Comments = ({ postId }: CommentsProps) => {
    const getComments = async () => {
        const res = await axiosRequest.get(`/comments?postId=${postId}`);
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["comments", postId],
        queryFn: getComments,
    });

    if (error) {
        console.error(error.message);
        return <CommentsError />;
    }

    if (isLoading) {
        return (
            <div className="comments">
                <Spinner />
            </div>
        );
    }

    if (!isLoading && data) {
        const comments: CommentsTypes = data;

        return (
            <div className="comments">
                <AddComment postId={postId} />
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        );
    }
};

export default Comments;
