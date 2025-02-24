import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Container } from "reactstrap";
import { GoogleLogin } from "@react-oauth/google";
import { toast, Bounce } from "react-toastify";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const validate = () => {
        let errors = {};
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Login submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await login(formData.email, formData.password);

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
        <Container className="container-cls">
            <h2>Sign In</h2>
            <Form onSubmit={handleSubmit}>
                {/* Email */}
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        invalid={!!errors.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>

                {/* Password */}
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        invalid={!!errors.password}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                </FormGroup>

                {/* Submit */}
                <Button className="w-100" color="success" type="submit">
                    Sign In
                </Button>
            </Form>

            <div className="mt-3 text-center">
                <p>Or login with Google</p>
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                />
            </div>
        </Container>
    );
};

export default Login;