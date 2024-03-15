import { ShareOutlined } from "@mui/icons-material";
import config from "../../../config/config";
import { PostTypes } from "../../post/post.types";
import "./webShare.scss";

const WebShare = ({ post }: PostTypes) => {
    const { id, desc } = post;

    const sharePost = () => {
        // Use the Web Share API if supported
        if (navigator.share) {
            navigator
                .share({
                    title: "Shared Post",
                    text: desc,
                    url: `${config.clientUrl}/post/${id}`,
                })
                .then(() => console.log("Shared successfully"))
                .catch((error) => console.error("Error sharing:", error));
        } else {
            console.log("Web Share API not supported.");
        }
    };

    return (
        <span className="share-web" onClick={sharePost}>
            <ShareOutlined />
        </span>
    );
};

export default WebShare;
