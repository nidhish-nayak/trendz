import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../../utils/axios.utils";

import Post from "../post/post";
import "./posts.scss";
import { PostsTypes } from "./posts.types";

const Posts = () => {
    const getAllPosts = async () => {
        const res = await axiosRequest.get("/posts");
        return res.data;
    };

    const { isLoading, data, error } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });

    if (error) {
        console.error(error);
        return;
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
    }
};

export default Posts;
