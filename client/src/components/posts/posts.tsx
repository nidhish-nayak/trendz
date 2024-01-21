import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../utils/axios.utils";

import { AxiosError } from "axios";
import Post from "../post/post";
import Spinner from "../spinner/spinner";
import "./posts.scss";
import { PostsTypes } from "./posts.types";

const Posts = () => {
    const navigate = useNavigate();

    const getAllPosts = async () => {
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
        }
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });

    if (error) {
        console.error(error.message);
        return (
            <div className="posts">
                <p className="posts-error">
                    We have some problems with the server. Please be patient
                    while we fix the issue!
                </p>
                <Spinner />
            </div>
        );
    }

    if (!isLoading) {
        const posts: PostsTypes = data.posts;

        return (
            <div className="posts">
                {posts.map((post) => (
                    <Post post={post} key={post.id} />
                ))}
            </div>
        );
    } else {
        return (
            <div className="posts">
                <Spinner />
            </div>
        );
    }
};

export default Posts;
