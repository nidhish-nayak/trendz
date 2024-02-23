import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import Spinner from "../../../components/spinner/spinner";
import { AuthContext } from "../../../context/authContext";
import { axiosRequest } from "../../../utils/axios.utils";
import "../profile.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileContext } from "../../../context/profileContext";
import {
    EDIT_PROFILE_FORM_TYPE,
    MUTATION_TYPE,
    USER_TYPES,
} from "../profile.types";

const EditProfile = ({ closeModal }: { closeModal: () => void }) => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { currentUser } = useContext(AuthContext);
    const { profileData, setProfileDataHandler } = useContext(ProfileContext);

    if (!currentUser || !id) {
        alert("User not logged in!");
        throw Error("User not logged in!");
    }

    const [formData, setFormData] = useState<USER_TYPES | null>(profileData);

    const mutation: MUTATION_TYPE = useMutation({
        mutationFn: (formData: EDIT_PROFILE_FORM_TYPE) =>
            axiosRequest.put("/users", formData),
        onSuccess: () => {
            if (formData === null) return alert("Null formData sent to server");
            setProfileDataHandler(formData);
            localStorage.setItem("user", JSON.stringify(formData));
            queryClient.invalidateQueries({ queryKey: ["users"] });
            closeModal();
        },
        onError: (error) => {
            console.error("Error creating user:", error);
        },
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (formData === null) {
            console.log("Form data loading...");
            return;
        }
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formData === null) return alert("form data is blank!");
        mutation.mutate(formData);
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
            <div className="edit-profile-image">
                <div className="user">
                    <img src={formData.profilePic!} alt="profile-pic" />
                    <input
                        type="file"
                        id="user-file"
                        name="user-file"
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                    <label htmlFor="user-file" className="user-edit">
                        Update
                    </label>
                </div>
                <div className="cover">
                    <img src={formData.coverPic!} alt="cover-pic" />
                    <input
                        type="file"
                        id="cover-file"
                        name="cover-file"
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                    <label htmlFor="cover-file" className="cover-edit">
                        Update
                    </label>
                </div>
            </div>
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
                            disabled={mutation.isPending}
                            className="save"
                        >
                            {mutation.isPending ? <Spinner /> : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
