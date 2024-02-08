import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import TagIcon from "@mui/icons-material/Tag";

import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "./share.scss";
import { NEW_POST_TYPES } from "./share.types";
import upload from "./upload";

const Share = () => {
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [localImgUrl, setLocalImgUrl] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);

    const mutation = useMutation({
        mutationFn: (newPost: NEW_POST_TYPES) =>
            axiosRequest.post("/posts", newPost),
        onSuccess: () => {
            setDesc("");
            setFile(null);
            // refetch on updated content
            return queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError(error) {
            console.log(error);
            return alert("Post upload failed!");
        },
    });

    if (!currentUser) return <div>User not found!</div>;

    const handleClick = async () => {
        let imgUrl: string | null = null;
        if (desc.length === 0) {
            alert("Please enter description to your post!");
            return;
        }
        if (file && file.size > 300000) {
            alert("Please upload image less than 300kb!");
            return;
        }

        // Upload file to server and get imgUrl back
        if (file) {
            imgUrl = await upload(file);
            if (!imgUrl) {
                alert("Upload failed!");
                return;
            }
        }

        mutation.mutate({ desc: desc, userId: currentUser.id, img: imgUrl });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return "File selection failed!";
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
            // Display image preview
            const url = URL.createObjectURL(selectedFile);
            setLocalImgUrl(url);
        }
    };

    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={currentUser.profilePic} alt="user-image" />
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                    <div className="right">
                        {file && localImgUrl && (
                            <div
                                className="image-delete"
                                onClick={() => setFile(null)}
                            >
                                <DeleteIcon fontSize="small" />
                            </div>
                        )}
                        {file && localImgUrl && (
                            <img
                                src={localImgUrl}
                                className="file"
                                alt="uploaded-img"
                            />
                        )}
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <input
                            type="file"
                            id="file"
                            name="file`"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <AttachFileIcon fontSize="small" />
                                <span>Add Image</span>
                            </div>
                        </label>
                        <div className="item">
                            <AddLocationAltIcon fontSize="small" />
                            <span>Add Place</span>
                        </div>
                        <div className="item">
                            <TagIcon fontSize="small" />
                            <span>Tag Friends</span>
                        </div>
                    </div>
                    <div className="right" title="Share">
                        <button onClick={handleClick}>
                            <SendIcon fontSize="medium" />
                        </button>
                    </div>
                </div>
                <hr className="mobile-only-hr" />
            </div>
        </div>
    );
};

export default Share;
