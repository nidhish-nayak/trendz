import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import TagIcon from "@mui/icons-material/Tag";

import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "./share.scss";
import { NEW_POST_TYPES } from "./share.types";

const Share = () => {
    const [file, setFile] = useState<File | null>(null);
    const [desc, setDesc] = useState("");

    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);

    const mutation = useMutation({
        mutationFn: (newPost: NEW_POST_TYPES) =>
            axiosRequest.post("/posts", newPost),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });

    if (!currentUser) return <div>User not found!</div>;

    const handleClick = async () => {
        if (desc.length === 0) {
            alert("Please enter description to your post!");
            return;
        }

        if (file && file.size > 300000) {
            setFile(null);
            alert("Please upload image less than 300kb!");
            return;
        }

        mutation.mutate({ desc: desc, userId: currentUser.id, file: file });
    };

    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={currentUser.profilePic} alt="user-image" />
                        <input
                            type="text"
                            placeholder={`What's on your mind ${currentUser.name}?`}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                    <div className="right">
                        {file && <img className="file" alt="" />}
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
                            onChange={(e) => {
                                if (!e.target.files) return;
                                setFile(e.target.files[0]);
                            }}
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
            </div>
        </div>
    );
};

export default Share;
