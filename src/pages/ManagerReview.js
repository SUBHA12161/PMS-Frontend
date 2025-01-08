import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody, CardHeader, Table } from "reactstrap";
import { AuthContext } from "../context/AuthContext";

const ManagerReviews = () => {
    const [subordinates, setSubordinates] = useState([]);
    const [selectedSubordinate, setSelectedSubordinate] = useState("");
    const [kpis, setKpis] = useState([]);
    const [selectedKpi, setSelectedKpi] = useState("");
    const [managerRating, setManagerRating] = useState("");
    const [managerRemarks, setManagerRemarks] = useState("");
    const [message, setMessage] = useState("");
    const [overallRating, setOverallRating] = useState("");
    const { user } = useContext(AuthContext);

    // Fetch subordinates and their reviews
    const fetchSubordinates = async () => {
        try {
            const response = await fetch(`/reviews/${user._id}`);
            const data = await response.json();

            if (response.ok) {
                setSubordinates(data.subordinates || []);
            } else {
                setMessage(data.message || "Error fetching subordinates");
            }
        } catch (error) {
            setMessage("Error fetching subordinates");
        }
    };

    const fetchRating = async (selectedSubordinate) => {
        try {
            const response = await fetch(`/reviews/overall/${selectedSubordinate}`);
            const data = await response.json();

            if (response.ok) {
                setOverallRating(data.overallPerformanceRating || 0);
            } else {
                setMessage(data.message || "Error fetching rating");
            }
        } catch (error) {
            setMessage("Error fetching rating");
        }
    };

    useEffect(() => {
        if (selectedSubordinate) {
            fetchRating(selectedSubordinate);
        }
    }, [selectedSubordinate]);

    useEffect(() => {
        fetchSubordinates();
    }, [user]);

    // Handle subordinate selection
    const handleSubordinateChange = (e) => {
        const subordinateId = e.target.value;
        setSelectedSubordinate(subordinateId);

        const subordinate = subordinates.find((sub) => sub._id === subordinateId);
        if (subordinate && subordinate.ratings) {
            setKpis(subordinate.ratings);
            fetchSubordinates()
        } else {
            setKpis([]);
        }
        setSelectedKpi("");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubordinate || !selectedKpi || !managerRating) {
            setMessage("Please fill all fields");
            return;
        }

        try {
            const response = await fetch("/reviews/manager", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    managerId: user._id,
                    subordinateId: selectedSubordinate,
                    kpiId: selectedKpi,
                    managerRating: parseFloat(managerRating),
                    remarks: managerRemarks,
                }),
            });

            const data = await response.json();

            setMessage(response.ok ? "Review submitted successfully" : data.message || "Error submitting review");

            if (response.ok) {
                fetchSubordinates(); // Refresh reviews after submission
            }
        } catch (error) {
            setMessage("Error submitting review");
        }
    };

    return (
        <div className="container mt-5">
            <Card>
                <CardHeader>
                    <h3>Manager Reviews</h3>
                </CardHeader>
                <CardBody>
                    {message && (
                        <Alert color={message.includes("success") ? "success" : "danger"}>{message}</Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="subordinate">Select Subordinate</Label>
                            <Input
                                type="select"
                                id="subordinate"
                                value={selectedSubordinate}
                                onChange={handleSubordinateChange}
                                required
                            >
                                <option value="">Select a subordinate</option>
                                {subordinates.map((subordinate) => (
                                    <option key={subordinate._id} value={subordinate._id}>
                                        {subordinate.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        {kpis.length > 0 && (
                            <FormGroup>
                                <Label for="kpi">Select KPI</Label>
                                <Input
                                    type="select"
                                    id="kpi"
                                    value={selectedKpi}
                                    onChange={(e) => setSelectedKpi(e.target.value)}
                                    required
                                >
                                    <option value="">Select a KPI</option>
                                    {kpis.map((kpi) => (
                                        <option key={kpi._id} value={kpi.kpi_id}>
                                            {kpi.kpi_id}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        )}

                        <FormGroup>
                            <Label for="managerRating">Manager Rating</Label>
                            <Input
                                type="number"
                                id="managerRating"
                                value={managerRating}
                                onChange={(e) => setManagerRating(e.target.value)}
                                placeholder="Enter Rating"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="comments">Comments</Label>
                            <Input
                                type="textarea"
                                name="comments"
                                id="comments"
                                placeholder="Enter comments"
                                onChange={(e) => setManagerRemarks(e.target.value)}
                            />
                        </FormGroup>

                        <Button color="primary" type="submit">
                            Submit Review
                        </Button>
                    </Form>

                    {kpis.length > 0 && (
                        <>
                            <div className="mt-5">
                                <h4>Subordinate KPI Ratings</h4>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>KPI ID</th>
                                            <th>Self Rating</th>
                                            <th>Manager Rating</th>
                                            <th>Employee Comments</th>
                                            <th>Manager Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kpis.map((kpi, index) => (
                                            <tr key={index}>
                                                <td>{kpi.kpi_id}</td>
                                                <td>{kpi.self_rating || "N/A"}</td>
                                                <td>{kpi.manager_rating || "N/A"}</td>
                                                <td>{kpi.comments || "N/A"}</td>
                                                <td>{kpi.manager_remarks || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            <div className="mt-5">
                                <h4>Overall Performance : {overallRating}</h4>
                            </div>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default ManagerReviews;