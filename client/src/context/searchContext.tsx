import { ReactNode, createContext, useState } from "react";

export type SEARCH_CONTEXT_TYPES = {
    search: string;
    handleSearch: (data: string) => void;
};

export const SearchContext = createContext<SEARCH_CONTEXT_TYPES>({
    search: "",
    handleSearch: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [search, setSearch] = useState("");

    const handleSearch = (data: string) => {
        setSearch(data);
    };

    const value = { search, handleSearch };
    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};
