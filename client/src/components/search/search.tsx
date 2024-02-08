import { useContext, useState } from "react";
import { SearchContext } from "../../context/searchContext";
import "./search.scss";

import CancelIcon from "@mui/icons-material/Cancel";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Search = () => {
    const [searchData, setSearchData] = useState("");
    const { handleSearch } = useContext(SearchContext);

    return (
        <div className="search">
            <div className="search-icon" title="Search">
                <SearchOutlinedIcon
                    fontSize="small"
                    onClick={() => handleSearch(searchData)}
                />
            </div>
            <input
                type="text"
                placeholder="Search..."
                value={searchData}
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
                <CancelIcon />
            </div>
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
        </div>
    );
};

export default Search;
