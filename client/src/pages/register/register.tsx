import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";

import config from "../../config/config";
import { RegisterTypes } from "./register.types";

// Loading component
const RegisterSpinner = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner-container" />
        </div>
    );
};

const defaultFormFields: RegisterTypes = {
    username: "",
    email: "",
    password: "",
    name: "",
};

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { username, email, password, name } = formFields;
    const [resData, setResData] = useState({ err: false, msg: "" }); // Response & Error Handling

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields({
            ...formFields,
            [name]: value,
        });
    };

    const registerUserHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const API_URL = `${config.serverUrl}/api/auth/register`;

        try {
            setIsLoading(true);
            setResData({ err: false, msg: "" });
            const response = await axios.post(API_URL, {
                username: username,
                email: email,
                password: password,
                name: name,
            });
            setResData({ err: false, msg: response.data });
            setIsLoading(false);
            alert("User registration successful!");
            navigate("/login");
        } catch (error) {
            const err = error as AxiosError;
            const res = JSON.parse(JSON.stringify(err.response?.data));
            console.error(error);
            setResData({ err: true, msg: res });
            setIsLoading(false);
        }
    };

    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <div className="left-heading">
                        <img
                            src="/logo.svg"
                            alt="logo-name"
                            className="logo-name"
                        />
                        <h1>
                            Trendz<span style={{ color: "#dd469e" }}>.</span>
                        </h1>
                        <p>
                            Welcome to our vibrant social media community, where
                            meaningful connections thrive. If you do not want to
                            create a new account, you can login as <b>Guest</b>{" "}
                            and enjoy the <b>read-only</b> features for free!
                        </p>
                    </div>
                    <div className="left-register">
                        <span>Already have an account ?</span>
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                width: "min-content",
                            }}
                        >
                            <button>Login</button>
                        </Link>
                    </div>
                </div>
                <div className="right">
                    <div className="right-title">
                        <h2>Don't have an account ?</h2>
                        <p>Register with your email and password</p>
                    </div>
                    <form onSubmit={registerUserHandler}>
                        <input
                            onChange={changeHandler}
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                        />
                        <input
                            onChange={changeHandler}
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            onChange={changeHandler}
                            type="password"
                            name="password"
                            placeholder="Password"
                            minLength={4}
                            required
                        />
                        <input
                            onChange={changeHandler}
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                        />
                        {resData.msg ? (
                            <div
                                className="response"
                                style={{
                                    color: resData.err ? "red" : "green",
                                }}
                            >
                                {resData.msg}
                            </div>
                        ) : (
                            <></>
                        )}
                        {isLoading ? (
                            <button type="button">
                                <RegisterSpinner />
                            </button>
                        ) : (
                            <button type="submit">Register</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
