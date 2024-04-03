import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import LanguageIcon from "@mui/icons-material/Language";
import PlaceIcon from "@mui/icons-material/Place";

import { Email, PersonAddDisabled } from "@mui/icons-material";
import { AxiosError } from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Posts from "../../components/posts/posts";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { ProfileContext } from "../../context/profileContext";
import { axiosRequest } from "../../utils/axios.utils";
import EditProfile from "./components/editProfile";
import FollowUser from "./components/followUser";
import "./profile.scss";
import { USER_TYPES } from "./profile.types";

type DELETE_FORM_TYPES = {
	username: string | null;
	password: string | null;
};

const Profile = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { id } = useParams();
	const { currentUser } = useContext(AuthContext);
	const { setFormDataHandler, setUserImgHandler, setCoverImgHandler } =
		useContext(ProfileContext);

	if (!currentUser || !id) throw Error("User not found!");

	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [mutationError, setMutationError] = useState<string | null>(null);
	const [deleteForm, setDeleteForm] = useState<DELETE_FORM_TYPES>({
		username: currentUser.username,
		password: null,
	});

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		return;
	}, [isDeleteOpen]);

	const mutation = useMutation({
		mutationFn: async (deleteForm: DELETE_FORM_TYPES) => {
			const res = await axiosRequest.post("auth/deregister", deleteForm);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users", id] });
			localStorage.clear();
			setIsButtonLoading(false);
			return navigate("/login");
		},
		onError(error: AxiosError) {
			setIsButtonLoading(false);
			console.log(error);
			setMutationError(
				JSON.parse(
					JSON.stringify(
						error.response ? error.response.data : error.message
					)
				)
			);
		},
	});

	const handleAccountDelete = () => {
		if (!deleteForm.username || !deleteForm.password) {
			return alert("Please fill all the fields!");
		}
		setIsButtonLoading(true);
		return mutation.mutate(deleteForm);
	};

	const getUsers = async (): Promise<USER_TYPES> => {
		const res = await axiosRequest.get(`/users/find/${id}`);
		return res.data;
	};

	const { isLoading, data, error } = useQuery({
		queryKey: ["users", id],
		queryFn: getUsers,
	});

	if (error) throw Error("getUsers failed!");

	if (isLoading)
		return (
			<div className="profile">
				<Spinner />
			</div>
		);

	if (!data) throw Error("No data retrieved");

	// Only set latest user profile if user is viewing his own profile
	if (data && data.id === currentUser.id) {
		localStorage.setItem("user", JSON.stringify(data));
	}

	const { username, email, name, coverPic, city, website, profilePic } = data;

	const handleClick = async () => {
		setFormDataHandler(data);
		setIsEditOpen(!isEditOpen);
	};

	const closeModal = () => {
		setCoverImgHandler(null);
		setUserImgHandler(null);
		setIsEditOpen(!isEditOpen);
	};

	return (
		<div className="profile" id="profile">
			<div className="user-container">
				<div className="images">
					{currentUser.id.toString() !== id ? null : (
						<div className="delete-account">
							<div
								className="delete-icon"
								onClick={() => setIsDeleteOpen(!isDeleteOpen)}
							>
								<PersonAddDisabled fontSize="small" />
							</div>
							{isDeleteOpen && (
								<div className="delete">
									<div className="delete-modal">
										<h2>Delete Account?</h2>
										<div className="inputs">
											<label>Username</label>
											<input
												type="text"
												required
												value={currentUser.username}
												placeholder="username"
												onChange={(e) =>
													setDeleteForm({
														...deleteForm,
														username:
															e.target.value,
													})
												}
											/>
										</div>
										<div className="inputs">
											<label>Password</label>
											<input
												type="password"
												required
												ref={inputRef}
												placeholder="!@#$%^&*()_+"
												onChange={(e) =>
													setDeleteForm({
														...deleteForm,
														password:
															e.target.value,
													})
												}
											/>
										</div>
										<div className="delete-buttons">
											<button
												className="delete-button"
												onClick={handleAccountDelete}
											>
												{isButtonLoading ? (
													<Spinner />
												) : (
													"Delete"
												)}
											</button>
											<button
												className="delete-cancel"
												onClick={() =>
													setIsDeleteOpen(
														!isDeleteOpen
													)
												}
											>
												Cancel
											</button>
										</div>
										{mutationError ? (
											<div>{mutationError}</div>
										) : null}
									</div>
								</div>
							)}
						</div>
					)}
					<img src={coverPic!} alt="Cover Photo" className="cover" />
					<img
						src={profilePic!}
						alt="Profile Photo"
						className="profilePic"
					/>
				</div>
				<div className="details">
					<div className="left">
						<div className="name">{name}</div>
						<div className="desc">
							<div className="desc-child">
								<p>Username:</p>
								<span title={username}>{username}</span>
							</div>
							<div className="desc-child">
								<p>Email:</p>
								<span title={email}>{email}</span>
							</div>
						</div>
						<FollowUser />
					</div>

					<div className="right">
						<div className="more">
							<a href={`mailto:${email}`}>
								<Email />
							</a>
							{currentUser.id !== parseInt(id) ? null : (
								<div className="edit" onClick={handleClick}>
									<EditIcon fontSize="small" />
									Edit
								</div>
							)}
							{isEditOpen ? (
								<EditProfile closeModal={closeModal} />
							) : null}
						</div>
						<div className="info">
							<div className="item city">
								<PlaceIcon />
								<div>{city ? city : "Unknown"}</div>
							</div>
							<a
								href={website!}
								title={website!}
								target="_blank"
								className="item"
							>
								<LanguageIcon />
							</a>
						</div>
					</div>
				</div>
			</div>
			<Posts />
		</div>
	);
};

export default Profile;
