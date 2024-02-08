import Posts from "../../components/posts/posts";
import Share from "../../components/share/share";
import Stories from "../../components/stories/stories";
import "./home.scss";

const Home = () => {
    return (
        <div id="home" className="home">
            <Stories />
            <Share />
            <Posts />
        </div>
    );
};

export default Home;
