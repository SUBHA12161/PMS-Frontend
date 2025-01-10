import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Table, Alert } from "reactstrap";
import "../../assets/css/loader.css";

const PerformanceList = () => {
    const [performances, setPerformances] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/Performance/get?page=${currentPage}&perPage=${perPage}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    setLoading(false);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setPerformances(data.performances);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setMessage("Failed to fetch performance data.");
                console.error("Error fetching performance data:", error);
            }
        };

        fetchPerformanceData();
    }, [currentPage, perPage]);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="blur-background"></div>
                <div className="loader-text"></div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pb-5 vh-100">
            <Card className="shadow">
                <CardHeader className="bg-warning text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Performance List</h3>
                    {message && <Alert color={"danger"}>{message}</Alert>}
                    <div>
                        <label htmlFor="perPage" className="mr-2">
                            Per Page:&nbsp;&nbsp;
                        </label>
                        <select
                            id="perPage"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="form-control d-inline-block w-auto"
                            style={{ borderRadius: "12px" }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table className="table-striped table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: "10%" }}>Employee Name</th>
                                <th style={{ width: "25%" }}>KPI</th>
                                <th style={{ width: "5%" }}>Weightage</th>
                                <th style={{ width: "5%" }}>Goal</th>
                                <th style={{ width: "5%" }}>Achievement</th>
                                <th style={{ width: "20%" }}>Weighted each rating</th>
                                <th style={{ width: "30%" }}>Qualitative Feedback by Manager</th>
                            </tr>
                        </thead>
                        <tbody>
                            {performances.length ? (
                                performances.map((performance) => (
                                    <tr key={performance._id}>
                                        <td>{performance.employeeName}</td>
                                        <td>{performance.kpiName}</td>
                                        <td>{performance.kpiWeightage}</td>
                                        <td>{performance.kpiGoal}</td>
                                        <td>{performance.kpiAchievement}</td>
                                        <td>{performance.average}</td>
                                        <td>{performance.remarks}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <div className="d-flex justify-content-between" style={{ gap: 10 }}>
                            <button
                                className="btn btn-sm btn-warning"
                                disabled={currentPage === 1 || totalPages === 0}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-warning"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default PerformanceList;