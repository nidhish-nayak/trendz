import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import Spinner from "../../../components/spinner/spinner";
import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import "../profile.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../config/config";
import { ProfileContext } from "../../../context/profileContext";
import { objectsAreEqual } from "../../../utils/objects.utils";
import upload from "../../../utils/upload.utils";
import { MUTATION_TYPE, USER_TYPES } from "../profile.types";
import UploadUser from "./uploadUser";

const EditProfile = ({ closeModal }: { closeModal: () => void }) => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	const { currentUser, setCurrentUserHandler } = useContext(AuthContext);
	const { userImg, coverImg, formData, setFormDataHandler } =
		useContext(ProfileContext);

	if (!currentUser || !id) {
		alert("User not logged in!");
		throw Error("User not logged in!");
	}

	const mutation: MUTATION_TYPE = useMutation({
		mutationFn: (formData: USER_TYPES) =>
			axiosRequest.put("/users", formData),
		onSuccess: () => {
			if (formData === null) return alert("No FormData!");
			queryClient.invalidateQueries({ queryKey: ["users", id] });
			setCurrentUserHandler(formData);
			setFormDataHandler(formData);
			setIsLoading(false);
			closeModal();
		},
		onError: (error) => {
			setIsLoading(false);
			console.error("Error creating user:", error);
		},
	});

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (formData === null) {
			console.log("Form data loading...");
			return;
		}
		setFormDataHandler({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		if (formData === null) return alert("Form data is blank!");

		// Define upload folder paths
		const userImgPath =
			config.s3.folders.profiles.users + `/${currentUser.username}`;
		const coverImgPath =
			config.s3.folders.profiles.covers + `/${currentUser.username}`;

		// Check all conditions
		if (!userImg && !coverImg) {
			if (objectsAreEqual(formData, currentUser))
				return alert("No updates made!");
			return mutation.mutate(formData);
		}

		if (userImg && !coverImg) {
			const userUrl = await upload(userImg, userImgPath);
			// Beware formData will only update once submitted - Hence direct mutation
			return mutation.mutate({ ...formData, profilePic: userUrl });
		}

		if (!userImg && coverImg) {
			const coverUrl = await upload(coverImg, coverImgPath);
			// Beware formData will only update once submitted - Hence direct mutation
			return mutation.mutate({ ...formData, coverPic: coverUrl });
		}

		// If both user & cover updated
		if (userImg && coverImg) {
			const userUrl = await upload(userImg, userImgPath);
			const coverUrl = await upload(coverImg, coverImgPath);
			// Beware formData will only update once submitted - Hence direct mutation
			return mutation.mutate({
				...formData,
				profilePic: userUrl,
				coverPic: coverUrl,
			});
		}

		setIsLoading(false);
		return alert("No updates made!");
	};

	if (formData === null) {
		return (
			<div className="edit-profile" id="edit-profile-id">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="edit-profile" id="edit-profile-id">
			<div className="edit-profile-header">
				<h2 className="edit-heading">Edit Profile</h2>
				<div className="close-icon" onClick={closeModal}>
					<CloseIcon />
				</div>
			</div>
			<UploadUser />
			<div className="form-container">
				<form onSubmit={handleSubmit} className="form">
					<div className="form-group-container">
						<div className="form-group">
							<label
								htmlFor="username"
								className={
									formData.username === ""
										? "empty"
										: "filled"
								}
							>
								Username <span>(unique)</span>
							</label>
							<input
								type="text"
								id="username"
								name="username"
								value={formData.username}
								onChange={handleChange}
								required
								minLength={3}
								maxLength={20}
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor="email"
								className={
									formData.email === "" ? "empty" : "filled"
								}
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor="name"
								className={
									formData.name === "" ? "empty" : "filled"
								}
							>
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor="city"
								className={
									formData.city === "" ? "empty" : "filled"
								}
							>
								City
							</label>
							<input
								type="text"
								id="city"
								name="city"
								value={
									formData.city === null ? "" : formData.city
								}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor="website"
								className={
									formData.website === "" ? "empty" : "filled"
								}
							>
								Website
							</label>
							<input
								type="url"
								id="website"
								name="website"
								value={
									formData.website === null
										? ""
										: formData.website
								}
								onChange={handleChange}
							/>
						</div>
					</div>
					{mutation.error?.response && (
						<div className="error-message">
							{JSON.parse(
								JSON.stringify(mutation.error.response.data)
							)}
						</div>
					)}
					<div className="button-container">
						<button
							type="button"
							onClick={closeModal}
							className="cancel"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="save"
						>
							{isLoading ? <Spinner /> : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
