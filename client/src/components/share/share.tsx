import { useContext, useState } from "react";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import TagIcon from "@mui/icons-material/Tag";

import { AxiosError } from "axios";
import { AuthContext } from "../../context/authContext";
import { axiosRequest } from "../../utils/axios.utils";
import "./share.scss";

const Share = () => {
    const [file, setFile] = useState<File | null>(null);
    const [desc, setDesc] = useState("");

    const { currentUser } = useContext(AuthContext);

    const addPost = async () => {
        try {
            const res = await axiosRequest.post("/posts", {
                desc: desc,
                userId: currentUser?.id,
                // image: null
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            alert("Post failed!");
            return err;
        }
    };

    const handleClick = async () => {
        console.log(file);
        if (desc.length === 0) {
            alert("Please enter description to your post!");
            return;
        }

        if (file && file.size > 300000) {
            setFile(null);
            alert("Please upload image less than 300kb!");
            return;
        }

        try {
            console.log("first");
        } catch (error) {
            throw new Error("Failed adding post!");
        }
    };

    if (!currentUser) return <div>User not found!</div>;

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
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                if (!e.target.files) return;
                                return setFile(e.target.files[0]);
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
