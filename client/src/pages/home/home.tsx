import { useContext } from "react";
import Posts from "../../components/posts/posts";
import Share from "../../components/share/share";
import Stories from "../../components/stories/stories";
import { PostContext } from "../../context/postContext";
import "./home.scss";

const Home = () => {
    const { isPostOpen } = useContext(PostContext);

    return (
        <div id="home" className="home">
            <Stories />
            {isPostOpen ? <Share /> : null}
            <Posts />
        </div>
    );
};

export default Home;
