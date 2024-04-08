import { ReactNode, createContext, useState } from "react";
import { USER_TYPES } from "../pages/profile/profile.types";

type PROFILE_CONTEXT_TYPES = {
    userImg: File | null;
    coverImg: File | null;
    formData: USER_TYPES | null;
    setUserImgHandler: (data: File | null) => void;
    setCoverImgHandler: (data: File | null) => void;
    setFormDataHandler: (data: USER_TYPES) => void;
};

export const ProfileContext = createContext<PROFILE_CONTEXT_TYPES>({
    userImg: null,
    coverImg: null,
    formData: {
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
    setFormDataHandler: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [userImg, setUserImg] = useState<File | null>(null);
    const [coverImg, setCoverImg] = useState<File | null>(null);
    const [formData, setFormData] = useState<USER_TYPES | null>(null);

    const setUserImgHandler = (file: File | null) => {
        setUserImg(file);
    };
    const setCoverImgHandler = (file: File | null) => {
        setCoverImg(file);
    };
    const setFormDataHandler = (data: USER_TYPES) => {
        setFormData(data);
    };

    const value = {
        userImg,
        coverImg,
        formData,
        setUserImgHandler,
        setCoverImgHandler,
        setFormDataHandler,
    };
    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
