import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Card, CardHeader, CardBody, Table, Alert } from "reactstrap";
import "../../assets/css/loader.css";

const KPIList = () => {
    const [kpis, setKpis] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const { logout, isTokenExpired } = useContext(AuthContext);

    useEffect(() => {
        const fetchKpis = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (isTokenExpired(token)) {
                    alert("Token has expired. Logging out...");
                    logout();
                    return;
                }

                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/kpi/get?page=${page}&limit=${perPage}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setKpis(data.kpis);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Failed to fetch KPIs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKpis();
    }, [page, perPage]);

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
                    <h3 className="mb-0">KPI List</h3>
                    <div>
                        <label htmlFor="perPage" className="mr-2">
                            Per Page:&nbsp;&nbsp;
                        </label>
                        <select
                            id="perPage"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(parseInt(e.target.value));
                                setPage(1);
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
                    {kpis.length > 0 ? (
                        <Table className="table-striped table-hover table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: "60%" }}>Name</th>
                                    <th style={{ width: "20%" }}>Weightage</th>
                                    <th style={{ width: "20%" }}>Goal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kpis.map((kpi) => (
                                    <tr key={kpi._id}>
                                        <td>{kpi.name}</td>
                                        <td>{kpi.weightage}%</td>
                                        <td>{kpi.goal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No KPIs found.</p>
                    )}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <div className="d-flex justify-content-between" style={{ gap: 10 }}>
                            <button
                                className="btn btn-sm btn-warning"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-warning"
                                disabled={page === totalPages}
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default KPIList;