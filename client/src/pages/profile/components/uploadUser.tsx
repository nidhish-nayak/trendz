import { ChangeEvent, useContext, useState } from "react";
import Spinner from "../../../components/spinner/spinner";
import config from "../../../config/config";
import { ProfileContext } from "../../../context/profileContext";
import upload from "../../../utils/upload.utils";

const UploadUser = () => {
	const [isUserLoading, setIsUserLoading] = useState(false);
	const [isCoverLoading, setIsCoverLoading] = useState(false);
	const {
		userImg,
		coverImg,
		profileData,
		setUserImgHandler,
		setCoverImgHandler,
	} = useContext(ProfileContext);

	// Show spinner if initial images not yet loaded
	if (
		!profileData ||
		profileData.profilePic === null ||
		profileData.coverPic === null
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

		let imgUrl: string | null = null;

		// Upload file to server and get imgUrl back
		if (selectedFile) {
			imgUrl = await upload(
				selectedFile,
				config.s3.folders.profiles.users + `/${profileData.username}`
			);
			if (!imgUrl) {
				alert("Upload failed!");
				return;
			}
			setUserImgHandler(imgUrl);
			setIsUserLoading(false);
		}
	};

	const handleCoverFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setIsCoverLoading(true);
		if (!e.target.files) return "File selection failed!";
		const selectedFile = e.target.files?.[0];

		let imgUrl: string | null = null;

		// Upload file to server and get imgUrl back
		if (selectedFile) {
			imgUrl = await upload(
				selectedFile,
				config.s3.folders.profiles.covers + `/${profileData.username}`
			);
			if (!imgUrl) {
				alert("Upload failed!");
				return;
			}
			setCoverImgHandler(imgUrl);
			setIsCoverLoading(false);
		}
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
								src={userImg ? userImg : profileData.profilePic}
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
								src={coverImg ? coverImg : profileData.coverPic}
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
