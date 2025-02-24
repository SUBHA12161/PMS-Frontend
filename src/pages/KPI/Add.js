import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    Form,
    FormGroup,
    Label,
    Input,
    Alert,
    Card,
    CardBody,
    CardHeader,
} from "reactstrap";
import "../../assets/css/KPI/style.css";

const KPIForm = () => {
    const [formData, setFormData] = useState({ name: "", weightage: "", goal: "", achievement: "" });
    const [message, setMessage] = useState("");
    const { logout, isTokenExpired } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if ((name === "weightage" || name === "goal") && value < 0) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isTokenExpired(token)) {
                alert("Token has expired. Logging out...");
                logout();
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/kpi/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            setMessage(data.message);
            setFormData({ name: "", weightage: "", goal: "", achievement: "" });
            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to add KPI");
        }
    };

    const inputStyle = { padding: "0.5rem", fontSize: "1rem" };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card className="shadow-sm" style={{ width: "450px" }}>
                <CardHeader className="bg-warning text-white">
                    <h5>Add KPI</h5>
                </CardHeader>
                <CardBody>
                    {message && (
                        <Alert
                            color={message.includes("successfully") ? "success" : "danger"}
                        >
                            {message}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit} style={{ alignItems: "normal", textAlign: "left" }}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="textarea"
                                name="name"
                                id="name"
                                placeholder="Enter KPI name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={{ ...inputStyle, resize: "vertical" }}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="weightage">Weightage</Label>
                            <Input
                                type="number"
                                name="weightage"
                                id="weightage"
                                placeholder="Enter weightage"
                                value={formData.weightage}
                                onChange={handleInputChange}
                                style={inputStyle}
                                min="0"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="goal">Goal</Label>
                            <Input
                                type="number"
                                name="goal"
                                id="goal"
                                placeholder="Enter goal"
                                value={formData.goal}
                                onChange={handleInputChange}
                                style={inputStyle}
                                min="0"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="achievement">Achievement ( Manager)</Label>
                            <Input
                                type="number"
                                name="achievement"
                                id="achievement"
                                placeholder="Enter achievement"
                                value={formData.achievement}
                                onChange={handleInputChange}
                                style={inputStyle}
                                min="0"
                                required
                            />
                        </FormGroup>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-3 mb-3 cust-btn"
                        >
                            Add KPI
                        </button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default KPIForm;