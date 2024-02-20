import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "./profile.scss";
import { EDIT_PROFILE_FORM_TYPE } from "./profile.types";

const EditProfile = ({ closeModal }: { closeModal: () => void }) => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const queryClient = useQueryClient();

    if (!currentUser || !id) {
        alert("User not logged in!");
        throw Error("User not logged in!");
    }

    const { username, email, name, city, website } = currentUser;

    const [formData, setFormData] = useState({
        id: parseInt(id),
        username: username,
        email: email,
        name: name,
        city: city === null ? "" : city,
        website: website === null ? "" : website,
    });

    const mutation = useMutation({
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
            (currentUser.username === formData.username &&
                currentUser.email === formData.email &&
                currentUser.name === formData.name &&
                (currentUser.city || "") === formData.city &&
                (currentUser.website || "") === formData.website) === true
        ) {
            return alert("No updates made!");
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
                    {mutation.error && (
                        <div className="error-message">
                            {mutation.error.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
