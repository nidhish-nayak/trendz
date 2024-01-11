import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";

import { RegisterTypes } from "./register.types";

const defaultFormFields: RegisterTypes = {
    username: "",
    email: "",
    password: "",
    name: "",
};

const Register = () => {
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
        const API_URL =
            process.env.NODE_ENV === "production"
                ? `${process.env.SERVER_URL}/api/auth/register`
                : "http://localhost:3000/api/auth/register";

        try {
            setResData({ err: false, msg: "" });
            const response = await axios.post(API_URL, {
                username: username,
                email: email,
                password: password,
                name: name,
            });
            setResData({ err: false, msg: response.data });
        } catch (error) {
            const err = error as AxiosError;
            const res = JSON.parse(JSON.stringify(err.response?.data));
            console.error(error);
            setResData({ err: true, msg: res });
        }
    };

    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <div className="left-heading">
                        <h1>LinkX.</h1>
                        <p>
                            Welcome to our vibrant social media community, where
                            meaningful connections thrive. Immerse yourself in a
                            world of shared experiences, as our platform
                            seamlessly brings together like minded individuals.
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
                    <div>
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
                        <button type="submit">Register</button>
                    </form>
                    <div
                        className="response"
                        style={{ color: resData.err ? "red" : "green" }}
                    >
                        {resData.msg}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
