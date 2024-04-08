import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import "./error.scss";

export default function ErrorPage() {
    const navigate = useNavigate();
    const error = useRouteError();
    console.error(error);

    useEffect(() => {
        localStorage.clear();
        navigate("/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="error-page">
            <h2 className="error-title">Oops!</h2>
            <div className="error-container">
                <p className="para">Sorry, an unexpected error has occurred.</p>
                <p className="para">
                    <p className="para">Client error:</p>
                    <i className="ital">{error.statusText || error.message}</i>
                </p>
                <p className="para">Might be an issue with the server:</p>
                <p className="para">
                    <p className="para" style={{ color: "#41cf7c" }}>
                        Check if server is running:{" "}
                        <a
                            className="link"
                            href="https://linkx-server.onrender.com/api/test"
                            target="_blank"
                        >
                            Server status
                        </a>
                    </p>
                </p>
            </div>
        </div>
    );
}
