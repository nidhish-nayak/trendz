import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

import config from "../../config/config";
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

    const handleGuestLogin = async () => {
        const guestUser = config.guestUser.username;
        const guestPassword = config.guestUser.password;

        const res = await login({
            username: guestUser,
            password: guestPassword,
        });
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
                        <img src="/logo.svg" alt="logo" className="logo" />
                        <h1>
                            Trendz<span style={{ color: "#dd469e" }}>.</span>
                        </h1>
                        <p>
                            Welcome to our vibrant social media community, where
                            meaningful connections thrive. If you do not want to
                            create a new account, you can login as <b>Guest</b>{" "}
                            and enjoy the features for free!
                        </p>
                    </div>
                </div>
                <div className="right">
                    <div>
                        <h2>Already have an account ?</h2>
                        <p>Sign in with your email and password</p>
                    </div>
                    <form onSubmit={handleLoginSubmit}>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="Enter here..."
                                onChange={changeHandler}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="username">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="!@#$%^&*()_+"
                                onChange={changeHandler}
                                minLength={4}
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="login-button">
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={handleGuestLogin}
                                className="guest-button"
                            >
                                Guest
                            </button>
                        </div>
                        <div style={{ color: "crimson" }}>{err}</div>
                    </form>
                    <div className="right-register">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
