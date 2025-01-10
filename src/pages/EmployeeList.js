import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Table } from "reactstrap";
import { Card, CardBody, CardHeader, Alert } from "reactstrap";

import "../assets/css/loader.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [message, setMessage] = useState("");
    const { user, logout, isTokenExpired } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            if (isTokenExpired(token)) {
                setMessage("Token has expired. Logging out...");
                logout();
                return;
            }
            const response = await fetch(
                user.role === "Admin"
                    ? `${process.env.REACT_APP_API_BASE_URL}/emp/get?page=${currentPage}&perPage=${perPage}`
                    : `${process.env.REACT_APP_API_BASE_URL}/emp/get?managerId=${user._id || ""}&page=${currentPage}&perPage=${perPage}`
                , {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
            const data = await response.json();
            setEmployees(data.employees);
            setTotalEmployees(data.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setLoading(false);
            setTimeout(() => {
                logout();
            }, 2000);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, perPage, user]);

    const totalPages = Math.ceil(totalEmployees / perPage);

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
                    <h3 className="mb-0">Employee List</h3>
                    {message && (
                        <Alert color={"danger"}>{message}</Alert>
                    )}
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
                            style={{ borderRadius: '12px' }}
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
                                <th style={{ width: "30%" }}>Name</th>
                                <th style={{ width: "40%" }}>Email</th>
                                <th style={{ width: "30%" }}>Designation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length ? employees.map((emp) => (
                                <tr key={emp._id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.role}</td>
                                </tr>
                            ))
                                :
                                "No data"
                            }
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>

                        <div className="d-flex justify-content-between" style={{ gap: 10 }}>
                            <button
                                className="btn btn-sm btn-warning"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-warning"
                                disabled={currentPage === totalPages}
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

export default EmployeeList;