import { PostsTypes } from "../components/posts/posts.types";

export const filterPosts = (
    posts: PostsTypes,
    search: string,
    profileUserId: number | undefined | null
): PostsTypes =>
    posts.filter((post) => {
        const searchText = search.toLowerCase();
        const postDesc = post.desc.toLowerCase();
        const userName = post.name.toLowerCase();
        const userId = post.userId;

        if (profileUserId)
            return (
                (postDesc.includes(searchText) ||
                    userName.includes(searchText)) &&
                userId === profileUserId
            );
        else
            return (
                postDesc.includes(searchText) || userName.includes(searchText)
            );
    });
