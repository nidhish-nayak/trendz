import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../utils/axios.utils";

import Post from "../post/post";
import Spinner from "../spinner/spinner";
import PostsError from "./posts.error";
import "./posts.scss";

import { PostsTypes } from "./posts.types";

const Posts = () => {
    const navigate = useNavigate();

    const getPosts = async () => {
        try {
            const res = await axiosRequest.get("/posts");
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            if (err?.response?.status) {
                localStorage.removeItem("user");
                navigate("/login");
                alert("Please login again!");
            }
            return err;
        }
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    if (error) {
        console.error(error.message);
        return <PostsError />;
    }

    if (!isLoading && data) {
        const posts: PostsTypes = data;

        return (
            <div className="posts">
                {posts.map((post) => (
                    <Post post={post} key={post.id} />
                ))}
            </div>
        );
    }

    return (
        <div className="posts">
            <Spinner />
        </div>
    );
};

export default Posts;
