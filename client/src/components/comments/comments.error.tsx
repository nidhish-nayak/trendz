import Spinner from "../spinner/spinner";

const CommentsError = () => {
	return (
		<div className="comments">
			<p className="comments-error">
				We have some problems with the server. Please be patient while
				we fix the issue!
			</p>
			<Spinner />
		</div>
	);
};

export default CommentsError;
