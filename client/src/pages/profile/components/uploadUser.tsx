import { ChangeEvent, useContext, useState } from "react";
import Spinner from "../../../components/spinner/spinner";
import { ProfileContext } from "../../../context/profileContext";

const UploadUser = () => {
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isCoverLoading, setIsCoverLoading] = useState(false);
    const [localUserImg, setLocalUserImg] = useState<string | null>(null);
    const [localCoverImg, setLocalCoverImg] = useState<string | null>(null);

    const { formData, setUserImgHandler, setCoverImgHandler } =
        useContext(ProfileContext);

    // Show spinner if initial images not yet loaded
    if (
        !formData ||
        formData.profilePic === null ||
        formData.coverPic === null
    ) {
        return (
            <div className="edit-profile-image">
                <Spinner />
            </div>
        );
    }

    const handleUserFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setIsUserLoading(true);
        if (!e.target.files) return "File selection failed!";
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return alert("File attach failed!");
        }

        const url = URL.createObjectURL(selectedFile);
        setLocalUserImg(url);
        setUserImgHandler(selectedFile);
        setIsUserLoading(false);
    };

    const handleCoverFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setIsCoverLoading(true);
        if (!e.target.files) return "File selection failed!";
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return alert("File not attached!");
        }

        const url = URL.createObjectURL(selectedFile);
        setLocalCoverImg(url);
        setCoverImgHandler(selectedFile);
        setIsCoverLoading(false);
    };

    return (
        <>
            <div className="edit-profile-image">
                <div className="user">
                    {isUserLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <img
                                src={
                                    localUserImg
                                        ? localUserImg
                                        : formData.profilePic
                                }
                                alt="profile-pic"
                            />

                            <input
                                type="file"
                                id="user-file"
                                name="user-file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleUserFileChange}
                            />
                            <label htmlFor="user-file" className="user-edit">
                                Update
                            </label>
                        </>
                    )}
                </div>
                <div className="cover">
                    {isCoverLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <img
                                src={
                                    localCoverImg
                                        ? localCoverImg
                                        : formData.coverPic
                                }
                                alt="cover-pic"
                            />

                            <input
                                type="file"
                                id="cover-file"
                                name="cover-file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleCoverFileChange}
                            />
                            <label htmlFor="cover-file" className="cover-edit">
                                Update
                            </label>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UploadUser;
