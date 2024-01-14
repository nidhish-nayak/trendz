import { useQuery } from "@tanstack/react-query";
import Post from "../post/post";

import { makeRequest } from "../../utils/axios.utils";
import "./posts.scss";

const Posts = () => {
    const postRequest = async () => {
        const res = await makeRequest.get("/posts");
        return res.data;
    };
    const { isLoading, error, data } = useQuery({
        queryKey: ["posts"],
        queryFn: postRequest,
    });

    return (
        <div className="posts">
            {posts.map((post) => (
                <Post post={post} key={post.id} />
            ))}
        </div>
    );
};

export default Posts;
