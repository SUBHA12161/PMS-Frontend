import React, { useState, useEffect , useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Table, Card, CardHeader, CardBody, Alert } from "reactstrap";

const EmployeeReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState("");
    const { user } = useContext(AuthContext);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/reviews/${user._id}`);
            const data = await response.json();

            if (response.ok) {
                setReviews(data.ratings || []);
            } else {
                setMessage(data.message || "Error fetching reviews");
            }
        } catch (error) {
            setMessage("Error fetching reviews");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [user]);

    return (
        <div className="container mt-5">
            <Card>
                <CardHeader>
                    <h3>Employee Reviews</h3>
                </CardHeader>
                <CardBody>
                    {message && (
                        <Alert color="danger">{message}</Alert>
                    )}

                    {reviews.length > 0 ? (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>KPI ID</th>
                                    <th>Self Rating</th>
                                    <th>Manager Rating</th>
                                    <th>Comments</th>
                                    <th>Manager Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review._id}>
                                        <td>{review.kpi_id}</td>
                                        <td>{review.self_rating || "N/A"}</td>
                                        <td>{review.manager_rating || "N/A"}</td>
                                        <td>{review.comments || "N/A"}</td>
                                        <td>{review.manager_remarks || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No reviews available</p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default EmployeeReviews;
