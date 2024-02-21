import { ReactNode, createContext, useState } from "react";

type PROFILE_CONTEXT_TYPES = {
    userImg: File | null;
    coverImg: File | null;
    setUserImgHandler: (file: File | null) => void;
    setCoverImgHandler: (file: File | null) => void;
};

export const ProfileContext = createContext<PROFILE_CONTEXT_TYPES>({
    userImg: null,
    coverImg: null,
    setUserImgHandler: () => {},
    setCoverImgHandler: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [userImg, setUserImg] = useState<File | null>(null);
    const [coverImg, setCoverImg] = useState<File | null>(null);

    const setUserImgHandler = (file: File | null) => {
        console.log("Context user: ", file);
        return setUserImg(file);
    };

    const setCoverImgHandler = (file: File | null) => {
        return setCoverImg(file);
    };

    const value = {
        userImg,
        coverImg,
        setUserImgHandler,
        setCoverImgHandler,
    };
    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
