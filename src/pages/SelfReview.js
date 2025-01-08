import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody } from "reactstrap";

const SelfReview = () => {
    const [form, setForm] = useState({ kpiId: "", selfRating: 0, comments: "" });
    const [message, setMessage] = useState("");
    const { user } = useContext(AuthContext);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/reviews/self", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId: user._id, ...form }),
            });
            const data = await response.json();
            setMessage(response.ok ? "Self-review submitted successfully" : data.message || "Error submitting review");
        } catch (error) {
            setMessage("Error: Unable to submit review");
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Card className="mt-5">
                <CardBody >
                    <h3>Self Review</h3>
                    {message && <Alert color={message.includes("successfully") ? "success" : "danger"}>{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="kpiId">KPI ID</Label>
                            <Input type="text" name="kpiId" id="kpiId" placeholder="Enter KPI ID" onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="selfRating">Rating</Label>
                            <Input type="number" name="selfRating" id="selfRating" placeholder="Enter your rating" onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="comments">Comments</Label>
                            <Input type="textarea" name="comments" id="comments" placeholder="Enter comments" onChange={handleInputChange} />
                        </FormGroup>
                        <Button color="primary" type="submit">Submit</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default SelfReview;