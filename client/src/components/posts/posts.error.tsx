import Spinner from "../spinner/spinner";

const PostsError = () => {
    return (
        <div className="posts">
            <p className="posts-error">
                We have some problems with the server. Please be patient while
                we fix the issue!
            </p>
            <Spinner />
        </div>
    );
};

export default PostsError;
