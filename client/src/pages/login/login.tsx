import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

import { LoginTypes } from "./login.types";

const defaultFormFields: LoginTypes = {
    username: "",
    password: "",
};

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [err, setErr] = useState<string | null>(null);
    const [formFields, setFormFields] = useState(defaultFormFields);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields({
            ...formFields,
            [name]: value,
        });
    };

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const res = await login(formFields);
        if (res.isLoggedIn === true) {
            navigate("/");
        }
        setErr(res.response);
    };

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <div className="left-heading">
                        <h1>Trendz.</h1>
                        <p>
                            Welcome to our vibrant social media community, where
                            meaningful connections thrive. Immerse yourself in a
                            world of shared experiences, as our platform
                            seamlessly brings together like minded individuals.
                        </p>
                    </div>
                    <div className="left-register">
                        <span>Don't have an account ?</span>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                width: "min-content",
                            }}
                        >
                            <button className="register-btn">Register</button>
                        </Link>
                        <button className="guest-btn">Guest</button>
                    </div>
                </div>
                <div className="right">
                    <div>
                        <h2>Already have an account ?</h2>
                        <p>Sign in with your email and password</p>
                    </div>
                    <form onSubmit={handleLoginSubmit}>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            onChange={changeHandler}
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={changeHandler}
                            minLength={4}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <div style={{ color: "crimson" }}>{err}</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
