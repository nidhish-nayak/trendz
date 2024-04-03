import { Search } from "@mui/icons-material";

const FriendsError = ({ title, error }: { title: string; error: string }) => {
	return (
		<div className="friends">
			<h3 className="friends-title">{title}</h3>
			<hr className="friends-divider" />
			<div className="friends-search">
				<div className="search-icon">
					<Search fontSize="small" />
				</div>
				<input type="text" placeholder="Search" onChange={() => {}} />
			</div>
			<div className="friends-list">{error}</div>
		</div>
	);
};

export default FriendsError;
