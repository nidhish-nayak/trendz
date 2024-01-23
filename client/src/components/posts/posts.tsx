import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../utils/axios.utils";

import { AxiosError } from "axios";
import { AuthContext } from "../../context/authContext";
import Post from "../post/post";
import Spinner from "../spinner/spinner";
import "./posts.scss";
import { PostsTypes } from "./posts.types";

const Posts = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const getAllPosts = async () => {
        try {
            const res = await axiosRequest.post("/posts", {
                userId: currentUser?.id,
            });
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

    console.log(data);

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

    if (!isLoading && data) {
        const posts: PostsTypes = data;

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
