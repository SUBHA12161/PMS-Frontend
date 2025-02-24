import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, Form, FormGroup, Label, Input, FormFeedback, Container } from "reactstrap";
import { toast, Bounce } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Student",
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
        if (!formData.name) {
            errors.name = "Name is required";
        }
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

    //submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await register(formData.name, formData.email, formData.password, formData.role);

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

                navigate("/login");
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
            }
        }
    };

    return (
        <Container className="container-cls">
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>
                {/* Name */}
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        invalid={!!errors.name}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>

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

                {/* Role */}
                <FormGroup>
                    <Label for="role">Role</Label>
                    <Input
                        type="select"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                    </Input>
                </FormGroup>

                {/* Submit */}
                <Button className="w-100" color="primary" type="submit">
                    Register
                </Button>
            </Form>
        </Container>
    );
};

export default Register;