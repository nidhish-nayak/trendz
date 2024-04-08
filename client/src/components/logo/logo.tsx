import { Link } from "react-router-dom";
import "./logo.scss";

const Logo = () => {
    return (
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="logo-container">
                Trend
                <span id="logo-span">z.</span>
            </div>
        </Link>
    );
};

export default Logo;
