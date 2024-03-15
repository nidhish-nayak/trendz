import { ShareOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import config from "../../../config/config";
import { PostTypes } from "../../post/post.types";
import "./webShare.scss";

const WebShare = ({ post }: PostTypes) => {
    const { id, name, desc, img } = post;
    const [postTitle, setPostTitle] = useState("Trendz - Social Media");
    const [postDescription, setPostDescription] = useState(
        "Welcome to Trendz, where our vibrant communities thrive!"
    );
    const [postImageUrl, setPostImageUrl] = useState(
        "https://github.com/nidhish-nayak/trendz/assets/76598208/a40c20aa-fc1e-4899-a693-b7db80a98296"
    );

    const handleShareClick = () => {
        setPostTitle(`${name}'s Post`);
        setPostDescription(desc);
        if (img) {
            setPostImageUrl(img);
        }
    };

    useEffect(() => {
        // Update Open Graph meta tags in the document's <head> section
        if (!document) return; // Ensure document is not null or undefined

        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogTitleMeta) {
            ogTitleMeta.setAttribute("content", postTitle);
        }

        const ogDescriptionMeta = document.querySelector(
            'meta[property="og:description"]'
        );
        if (ogDescriptionMeta) {
            ogDescriptionMeta.setAttribute("content", postDescription);
        }

        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (ogImageMeta) {
            ogImageMeta.setAttribute("content", postImageUrl);
        }
    }, [postTitle, postDescription, postImageUrl]);

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
        <span
            className="share-web"
            onClick={() => {
                handleShareClick();
                sharePost();
            }}
        >
            <ShareOutlined />
        </span>
    );
};

export default WebShare;
