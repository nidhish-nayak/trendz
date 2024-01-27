import { useQuery } from "@tanstack/react-query";

import Post from "../post/post";
import Spinner from "../spinner/spinner";
import { getAllPosts } from "./posts.axios";
import PostsError from "./posts.error";
import "./posts.scss";

import { PostsTypes } from "./posts.types";

const Posts = () => {
    const { isLoading, data, error } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
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
