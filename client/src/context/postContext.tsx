import { ReactNode, createContext, useState } from "react";

export const PostContext = createContext({
	isPostOpen: false,
	setIsPostOpen: () => {},
});

export const PostProvider = ({ children }: { children: ReactNode }) => {
	const [isPostOpen, setIsPostOpenHandler] = useState(false);

	const setIsPostOpen = () => {
		setIsPostOpenHandler(!isPostOpen);
	};

	const value = { isPostOpen, setIsPostOpen };
	return (
		<PostContext.Provider value={value}>{children}</PostContext.Provider>
	);
};
