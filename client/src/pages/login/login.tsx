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
    const [err, setErr] = useState("");
    const { currentUser, login } = useContext(AuthContext);
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
        try {
            await login(formFields);
            if (currentUser) {
                setErr("User login success!");
                navigate("/");
            } else {
                setErr("Incorrect username or password!");
            }
        } catch (error) {
            const err = JSON.parse(JSON.stringify(error));
            setErr(err.response.data);
            console.log(err);
        }
    };

    return (
        <div className="login">
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
                        <span>Don't have an account ?</span>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                width: "min-content",
                            }}
                        >
                            <button>Register</button>
                        </Link>
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
                    <div>{JSON.parse(JSON.stringify(err))}</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
