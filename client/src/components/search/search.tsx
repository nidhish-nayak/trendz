import { useContext, useState } from "react";
import { SearchContext } from "../../context/searchContext";
import "./search.scss";

import CancelIcon from "@mui/icons-material/Cancel";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useLocation } from "react-router-dom";

const Search = () => {
	const location = useLocation();
	const [searchData, setSearchData] = useState("");
	const { handleSearch } = useContext(SearchContext);

	if (location.pathname !== "/") {
		return <span />;
	}

	return (
		<div className="search">
			<div
				className="search-icon"
				title="Search"
				onClick={() => handleSearch(searchData)}
			>
				<SearchOutlinedIcon fontSize="small" />
			</div>
			<input
				type="text"
				placeholder="Search..."
				value={searchData}
				onKeyDown={(e) => {
					if (e.key === "Enter") return handleSearch(searchData);
				}}
				onChange={(e) => setSearchData(e.target.value)}
			/>
			<div
				className="cancel-icon"
				title="Reset Filter"
				onClick={() => {
					setSearchData("");
					handleSearch("");
				}}
			>
				{searchData === "" ? null : <CancelIcon />}
			</div>
			{searchData === "" ? null : (
				<button
					className="clear-btn"
					title="Clear Filter"
					onClick={() => {
						setSearchData("");
						handleSearch("");
					}}
				>
					clear
				</button>
			)}
		</div>
	);
};

export default Search;
