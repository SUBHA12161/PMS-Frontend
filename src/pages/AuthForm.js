import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast, Bounce } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import "../assets/css/AuthForm.css";

const AuthForm = () => {
    const [isRightPanelActive, setRightPanelActive] = useState(false);
    const navigate = useNavigate();
    const { login, register } = useContext(AuthContext);

    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employe",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSignUpClick = () => {
        setRightPanelActive(true);
        setErrors({});
    };

    const handleSignInClick = () => {
        setRightPanelActive(false);
        setErrors({});
    };

    const handleChange = (e, formType) => {
        if (formType === "signIn") {
            setSignInData({
                ...signInData,
                [e.target.name]: e.target.value.trim(),
            });
        } else if (formType === "signUp") {
            setSignUpData({
                ...signUpData,
                [e.target.name]: e.target.value.trim(),
            });
        }
    };

    const validate = (formType) => {
        let errors = {};

        if (formType === "signIn") {
            if (!signInData.email) {
                errors.email = "Email is required";
            } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(signInData.email)) {
                errors.email = "Invalid email format";
            }
            if (!signInData.password) {
                errors.password = "Password is required";
            }
        } else if (formType === "signUp") {
            if (!signUpData.name) {
                errors.name = "Name is required";
            }
            if (!signUpData.email) {
                errors.email = "Email is required";
            } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(signUpData.email)) {
                errors.email = "Invalid email format";
            }
            if (!signUpData.password) {
                errors.password = "Password is required";
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle sign-in submission
    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        if (validate("signIn")) {
            setLoading(true);
            try {
                await login(signInData.email, signInData.password);

                toast.success("Login successful!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Bounce,
                });
                navigate("/");
                setLoading(false);
            } catch (err) {
                toast.error(err.response?.data?.message || "Login failed!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Bounce,
                });
                setLoading(false);
            }
        }
    };

    // Handle sign-up submission
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (validate("signUp")) {
            setLoading(true);
            try {
                await register(signUpData.name, signUpData.email, signUpData.password, signUpData.role);

                toast.success("Registration successful!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Bounce,
                });
                setLoading(false);
                navigate("/");
            } catch (err) {
                toast.error(err.response?.data?.message || "Registration failed!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Bounce,
                });
                setLoading(false);
            }
        }
    };

    // Google login
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/auth/google`, {
                token: credentialResponse.credential,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            toast.success("Google login successful!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                transition: Bounce,
            });

            navigate("/");
        } catch (error) {
            toast.error("Google login failed!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                transition: Bounce,
            });
        }
    };

    const handleGoogleLoginFailure = () => {
        toast.error("Google login failed!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
        });
    };

    return (
        <div className="center-align-class">
            <div className={`container container-class ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUpSubmit}>
                        <h1>Sign Up</h1>
                        <input
                            autoComplete="off"
                            className={errors.name ? "invalid-input" : ""}
                            name="name"
                            value={signUpData.name}
                            onChange={(e) => handleChange(e, "signUp")}
                            type="text"
                            placeholder="Name"
                            invalid={!!errors.name}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                        <input
                            autoComplete="off"
                            className={errors.email ? "invalid-input" : ""}
                            name="email"
                            value={signUpData.email}
                            onChange={(e) => handleChange(e, "signUp")}
                            type="email"
                            placeholder="Email"
                            invalid={!!errors.email}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                        <input
                            autoComplete="off"
                            className={errors.password ? "invalid-input" : ""}
                            name="password"
                            value={signUpData.password}
                            onChange={(e) => handleChange(e, "signUp")}
                            type="password"
                            placeholder="Password"
                            invalid={!!errors.password}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <button type="submit" disabled={loading}>
                            {loading ?
                                <div class="loader"></div>
                                :
                                "Sign Up"}</button>
                        <div className="mt-2 text-center">
                            <p>Or continue with Google</p>
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginFailure}
                            />
                        </div>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignInSubmit}>
                        <h1>Sign In</h1>
                        <input
                            autoComplete="off"
                            className={errors.email ? "invalid-input mt-3" : "mt-3"}
                            name="email"
                            type="email"
                            value={signInData.email}
                            onChange={(e) => handleChange(e, "signIn")}
                            placeholder="Email"
                            invalid={!!errors.email}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                        <input
                            autoComplete="off"
                            className={errors.password ? "invalid-input mt-3" : "mt-3"}
                            name="password"
                            type="password"
                            value={signInData.password}
                            onChange={(e) => handleChange(e, "signIn")}
                            placeholder="Password"
                            invalid={!!errors.password}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <button type="submit" disabled={loading} className="mt-3">
                            {loading ?
                                <div class="loader"></div>
                                :
                                "Sign In"}</button>
                    </form>
                </div>

                {/* Overlay for sign up/sign in */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To stay connected with us please login with your personal info</p>
                            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Buddy!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className="ghost mt-3" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;