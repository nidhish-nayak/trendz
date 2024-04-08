import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useContext, useState } from "react";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

import config from "../../config/config";
import { AuthContext } from "../../context/authContext";
import { PostContext } from "../../context/postContext";
import { axiosRequest } from "../../utils/axios.utils";
import upload from "../../utils/upload.utils";
import Spinner from "../spinner/spinner";
import "./share.scss";
import { NEW_POST_TYPES } from "./share.types";

const Share = () => {
    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    const { setIsPostOpen } = useContext(PostContext);

    const [desc, setDesc] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [localImgUrl, setLocalImgUrl] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: (newPost: NEW_POST_TYPES) =>
            axiosRequest.post("/posts", newPost),
        onSuccess: () => {
            setDesc("");
            setFile(null);
            setIsPostOpen(); // close post after uploading
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            return setUploading(false);
        },
        onError(error) {
            console.log(error);
            setUploading(false);
            return alert("Post upload failed!");
        },
    });

    if (!currentUser) return <div>User not found!</div>;

    const submitPost = async () => {
        if (desc.length === 0) {
            alert("Please enter description to your post!");
            return;
        }
        if (file && file.size > 5242880) {
            alert("Please upload image less than 5MB!");
            return;
        }

        setUploading(true);
        let imgUrl: string | null = null;
        let filename: string | null = null;

        // Upload file to server and get imgUrl back
        if (file) {
            imgUrl = await upload(file, config.s3.folders.posts);
            filename = file.name;
            if (!imgUrl) {
                setUploading(false);
                return;
            }
        }

        mutation.mutate({
            desc: desc,
            userId: currentUser.id,
            img: imgUrl,
            filename: filename,
        });
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
                    </div>
                    <div className="right" title="Share">
                        {uploading ? (
                            <Spinner />
                        ) : (
                            <button onClick={submitPost}>
                                <SendIcon fontSize="medium" />
                            </button>
                        )}
                    </div>
                </div>
                <hr className="mobile-only-hr" />
            </div>
        </div>
    );
};

export default Share;
