import { useRouteError } from "react-router-dom";
import "./error.scss";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="error-page">
            <h2>Oops!</h2>
            <div>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <p>Client error:</p>
                    <i>{error.statusText || error.message}</i>
                </p>
                <p>Might be an issue with the server:</p>
                <p>
                    <p style={{ color: "#41cf7c" }}>
                        Check if server is running:{" "}
                        <a
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
