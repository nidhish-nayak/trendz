import { useContext, useState } from "react";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import TagIcon from "@mui/icons-material/Tag";

import { AuthContext } from "../../context/authContext";
import "./share.scss";

const Share = () => {
    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState("");

    const { currentUser } = useContext(AuthContext);

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
                            style={{ display: "none" }}
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
                        <SendIcon fontSize="medium" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;
