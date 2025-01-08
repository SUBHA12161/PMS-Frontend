import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody } from "reactstrap";

const AddEmployee = () => {
    const [form, setForm] = useState({ name: "", email: "", designation: "", managerId: "", password: "" });
    const [managers, setManagers] = useState([]);
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchManagers = async () => {
        try {
            const response = await fetch("/managers");
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

        // If managerId is empty, set it to null before submitting
        const sanitizedForm = {
            ...form,
            managerId: form.managerId === "" ? null : form.managerId
        };

        try {
            const response = await fetch("/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sanitizedForm),
            });
            const data = await response.json();
            setMessage(response.ok ? "Employee added successfully" : data.message || "Error adding employee");
        } catch (error) {
            setMessage("Error: Unable to add employee");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <Card className="mt-5">
                <CardBody>
                    {message && (
                        <Alert color={message.includes("successfully") ? "success" : "danger"}>{message}</Alert>
                    )}
                    <Form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter name"
                                value={form.name}
                                onChange={handleInputChange}
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
                                required
                            >
                                <option value="" disabled>Select designation</option>
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
                            >
                                <option value="">Select manager</option>
                                {managers.map((manager) => (
                                    <option key={manager._id} value={manager._id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <Button color="primary" type="submit" block>
                            Add Employee
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AddEmployee;