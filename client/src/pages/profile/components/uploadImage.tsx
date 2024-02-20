import { ChangeEvent, useState } from "react";
import "../profile.scss";
import { UPLOAD_IMAGE_PROPS_TYPE } from "../profile.types";

const UploadImage = ({ profilePic, coverPic }: UPLOAD_IMAGE_PROPS_TYPE) => {
    const [userImg, setUserImg] = useState<File | null>(null);
    const [coverImg, setCoverImg] = useState<File | null>(null);
    const [localUserImgUrl, setLocalUserImgUrl] = useState<string | null>(null);
    const [localCoverImgUrl, setLocalCoverImgUrl] = useState<string | null>(
        null
    );

    const handleUserImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return "File selection failed!";
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setUserImg(selectedFile);
            // Display image preview
            const url = URL.createObjectURL(selectedFile);
            setLocalUserImgUrl(url);
        }
    };

    const handleCoverImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return "File selection failed!";
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setCoverImg(selectedFile);
            // Display image preview
            const url = URL.createObjectURL(selectedFile);
            setLocalCoverImgUrl(url);
        }
    };

    return (
        <>
            <div className="user">
                <img
                    src={localUserImgUrl ? localUserImgUrl : profilePic}
                    alt="profile-pic"
                />
                <input
                    type="file"
                    id="user-file"
                    name="user-file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleUserImgChange}
                />
                <label htmlFor="user-file" className="user-edit">
                    Upload
                </label>
            </div>
            <div className="cover">
                <img
                    src={localCoverImgUrl ? localCoverImgUrl : coverPic}
                    alt="cover-pic"
                />
                <input
                    type="file"
                    id="cover-file"
                    name="cover-file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleCoverImgChange}
                />
                <label htmlFor="cover-file" className="cover-edit">
                    Upload
                </label>
            </div>
        </>
    );
};

export default UploadImage;
