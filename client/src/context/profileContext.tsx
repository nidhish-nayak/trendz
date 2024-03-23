import { ReactNode, createContext, useState } from "react";
import { USER_TYPES } from "../pages/profile/profile.types";

type PROFILE_CONTEXT_TYPES = {
	userImg: string | null;
	coverImg: string | null;
	profileData: USER_TYPES | null;
	setUserImgHandler: (data: string | null) => void;
	setCoverImgHandler: (data: string | null) => void;
	setProfileDataHandler: (data: USER_TYPES) => void;
};

export const ProfileContext = createContext<PROFILE_CONTEXT_TYPES>({
	userImg: null,
	coverImg: null,
	profileData: {
		id: 0,
		name: "",
		email: "",
		username: "",
		city: "",
		website: "",
		coverPic: null,
		profilePic: null,
	},
	setUserImgHandler: () => {},
	setCoverImgHandler: () => {},
	setProfileDataHandler: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
	const [userImg, setUserImg] = useState<string | null>(null);
	const [coverImg, setCoverImg] = useState<string | null>(null);
	const [profileData, setProfileData] = useState<USER_TYPES | null>(null);

	const setUserImgHandler = (data: string | null) => {
		setUserImg(() => data);
	};
	const setCoverImgHandler = (data: string | null) => {
		setCoverImg(() => data);
	};
	const setProfileDataHandler = (data: USER_TYPES) => {
		setProfileData(() => data);
	};

	const value = {
		userImg,
		coverImg,
		profileData,
		setUserImgHandler,
		setCoverImgHandler,
		setProfileDataHandler,
	};
	return (
		<ProfileContext.Provider value={value}>
			{children}
		</ProfileContext.Provider>
	);
};
