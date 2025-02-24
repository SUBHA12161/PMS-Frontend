import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, FormGroup, Label, Input, Alert, Card, CardBody, CardHeader } from "reactstrap";

const AddEmployee = () => {
    const [form, setForm] = useState({ name: "", email: "", designation: "", managerId: "", password: "" });
    const [managers, setManagers] = useState([]);
    const [message, setMessage] = useState("");
    const { logout, isTokenExpired } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchManagers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/managers`, {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setManagers(data.employees || []);
            } else {
                setMessage("Failed to fetch managers.");
            }
        } catch (error) {
            setMessage("Error fetching managers.");
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedForm = {
            ...form,
            managerId: form.managerId === "" ? null : form.managerId,
        };

        try {
            if(isTokenExpired(token)){
                alert("Token has expired. Logging out...");
                logout();
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/emp/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(sanitizedForm),
            });
            const data = await response.json();
            setMessage(response.ok ? "Employee added successfully" : data.message || "Error adding employee");
            setTimeout(() => {
                setForm({ name: "", email: "", designation: "", managerId: "", password: "" });
                setMessage("");
            }, 3000);
        } catch (error) {
            setMessage("Error: Unable to add employee");
            setTimeout(() => {
                logout();
            }, 2000);
        }
    };

    const inputStyle = { width: "100%" };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card className="shadow-sm" style={{ width: "450px", alignItems: 'left' }}>
                <CardHeader className="bg-warning text-white">
                    <h5>Add Employee</h5>
                </CardHeader>
                <CardBody>
                    {message && (
                        <Alert color={message.includes("successfully") ? "success" : "danger"}>{message}</Alert>
                    )}
                    <Form onSubmit={handleSubmit}
                        style={{ alignItems: 'normal', textAlign: 'left' }}
                    >
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter name"
                                value={form.name}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="designation">Designation</Label>
                            <Input
                                type="select"
                                name="designation"
                                id="designation"
                                value={form.designation}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            >
                                <option value="" disabled>
                                    Select designation
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="Business Manager">Business Manager</option>
                                <option value="CEO">CEO</option>
                                <option value="Executives/Associates">Executives/Associates</option>
                                <option value="Manager">Manager</option>
                                <option value="Program Head">Program Head</option>
                                <option value="Program Manager">Program Manager</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="managerId">Manager</Label>
                            <Input
                                type="select"
                                name="managerId"
                                id="managerId"
                                value={form.managerId}
                                onChange={handleInputChange}
                                style={inputStyle}
                            >
                                <option value="">Select manager</option>
                                {managers.map((manager) => (
                                    <option key={manager._id} value={manager._id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <button color="primary" type="submit" className="mt-3 mb-3" block>
                            Add Employee
                        </button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AddEmployee;