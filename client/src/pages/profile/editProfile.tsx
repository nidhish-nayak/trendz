import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "./profile.scss";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    EDIT_PROFILE_FORM_TYPE,
    MUTATION_TYPE,
    USER_TYPES,
} from "./profile.types";

const EditProfile = ({
    closeModal,
    profileData,
}: {
    closeModal: () => void;
    profileData: USER_TYPES;
}) => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const queryClient = useQueryClient();

    if (!currentUser || !id) {
        alert("User not logged in!");
        throw Error("User not logged in!");
    }

    const [formData, setFormData] = useState({
        id: parseInt(id),
        username: profileData.username,
        email: profileData.email,
        name: profileData.name,
        city: profileData.city === null ? "" : profileData.city,
        website: profileData.website === null ? "" : profileData.website,
    });

    const mutation: MUTATION_TYPE = useMutation({
        mutationFn: (formData: EDIT_PROFILE_FORM_TYPE) =>
            axiosRequest.put("/users", formData),
        onSuccess: () => {
            console.log("User created successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            closeModal();
        },
        onError: (error) => {
            console.error("Error creating user:", error);
        },
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if form data changes were made
        if (
            formData.name === profileData.name &&
            formData.username === profileData.username &&
            formData.email === profileData.email &&
            formData.city === profileData.city &&
            formData.website === profileData.website
        ) {
            alert("No updates made!");
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <div className="edit-profile" id="edit-profile-id">
            <div className="edit-profile-header">
                <h2 className="edit-heading">Edit Profile</h2>
                <div className="close-icon" onClick={closeModal}>
                    <CloseIcon />
                </div>
            </div>
            <div className="edit-profile-image">
                <div className="user">User Image</div>
                <div className="cover">Cover Image</div>
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
                                value={formData.city}
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
                                value={formData.website}
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
