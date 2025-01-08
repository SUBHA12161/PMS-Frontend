import React, { useState, useEffect, useContext } from "react";
import { Table } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { Card, CardBody, CardHeader } from "reactstrap";

import "../assets/css/loader.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalEmployees, setTotalEmployees] = useState(0);

    const { user } = useContext(AuthContext);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const url =
                user.role === "Admin"
                    ? `/api/employees?page=${currentPage}&perPage=${perPage}`
                    : `/api/employees?managerId=${user._id || ""}&page=${currentPage}&perPage=${perPage}`;
            const response = await fetch(url);
            const data = await response.json();
            setEmployees(data.employees);
            setTotalEmployees(data.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, perPage]);

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
        <div className="container mt-5 pb-5">
            <Card className="shadow">
                <CardHeader className="bg-warning text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Employee List</h3>
                    <div>
                        <label htmlFor="perPage" className="mr-2">
                            Per Page:
                        </label>
                        <select
                            id="perPage"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(parseInt(e.target.value));
                                setCurrentPage(1); // Reset to first page
                            }}
                            className="form-control d-inline-block w-auto"
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
                            {employees.map((emp) => (
                                <tr key={emp._id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center mt-3">

                        <span>
                            Page {currentPage} of {totalPages}
                        </span>


                        <div style={{ gap: 10 }}>
                            <button
                                className="btn btn-primary"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-primary"
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