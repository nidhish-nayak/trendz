import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../../utils/axios.utils";

import Spinner from "../spinner/spinner";
import PostsError from "./posts.error";
import "./posts.scss";

import { SearchContext } from "../../context/searchContext";
import { filterPosts } from "../../utils/filterPosts.util";
import Post from "../post/post";
import { PostPageTypes, PostsTypes } from "./posts.types";
import { AuthContext } from "../../context/authContext";

const Posts = () => {
    const param = useParams();
    const { search } = useContext(SearchContext);
    const { currentUser } = useContext(AuthContext);
    const profileUserId = param.id ? parseInt(param.id) : undefined;
    const lastPostRef = useRef<HTMLElement>(null);

    if (!currentUser) throw Error("User not found!");
    const id = currentUser.id;

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 0.5,
    });

    const getPosts = async ({ pageParam }: { pageParam: number }) => {
        const res = await axiosRequest.get(
            // Page size 10 = 10 posts fetched on scroll
            `/posts?page=${pageParam}&pageSize=10`
        );
        return res.data;
    };

    const { data, error, fetchNextPage, isLoading, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["posts", id],
            queryFn: getPosts,
            initialPageParam: 1,
            getNextPageParam: (lastPage, _allPages, lastPageParam) => {
                if (lastPage.length === 0) {
                    return undefined;
                }
                return lastPageParam + 1;
            },
        });

    useEffect(() => {
        if (entry?.isIntersecting) fetchNextPage();
    }, [entry, fetchNextPage]);

    if (error) {
        console.error(error.message);
        return <PostsError />;
    }

    if (!data || isLoading) {
        return <Spinner />;
    }

    // Infinite scroll - return data needs to be mapped twice
    const posts: PostsTypes = data.pages.flatMap((group) => group);

    if (posts.length < 1) {
        return (
            <div className="posts">
                <div className="empty">
                    No posts found - Add post / Follow someone
                </div>
            </div>
        );
    }

    return (
        <div className="posts">
            {filterPosts(posts, search, profileUserId).map(
                (post: PostPageTypes, i) => {
                    if (i === posts.length - 1)
                        return (
                            <div ref={ref} key={post.id}>
                                <Post post={post} key={post.id} />
                            </div>
                        );
                    return <Post post={post} key={post.id} />;
                }
            )}

            {isFetchingNextPage ? (
                <Spinner />
            ) : (
                <button className="load-more">Nothing more to load</button>
            )}
        </div>
    );
};

export default Posts;
