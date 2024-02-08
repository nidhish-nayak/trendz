import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../utils/axios.utils";

import Post from "../post/post";
import Spinner from "../spinner/spinner";
import PostsError from "./posts.error";
import "./posts.scss";

import { useContext } from "react";
import { SearchContext } from "../../context/searchContext";
import { PostsTypes } from "./posts.types";

const Posts = () => {
    const navigate = useNavigate();
    const { search } = useContext(SearchContext);

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
        const filteredPosts = posts.filter((post) => {
            const searchText = search.toLowerCase();
            const postDesc = post.desc.toLowerCase();
            const userName = post.name.toLowerCase();

            return (
                postDesc.includes(searchText) || userName.includes(searchText)
            );
        });

        return (
            <div className="posts">
                {filteredPosts.map((post) => (
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
