import { useQuery } from "@tanstack/react-query";
import Post from "../post/post";

import { makeRequest } from "../../utils/axios.utils";
import "./posts.scss";

const Posts = () => {
    const { isLoading, error, data } = useQuery(["posts"], () =>
        makeRequest.get("/posts").then((res) => res.data)
    );

    return (
        <div className="posts">
            {posts.map((post) => (
                <Post post={post} key={post.id} />
            ))}
        </div>
    );
};

export default Posts;
