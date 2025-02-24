import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    Table, Card, CardHeader, CardBody, Alert, Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Label,
    Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../assets/css/loader.css";

const EmployeeReviews = () => {
    const { user } = useContext(AuthContext);
    const [performances, setPerformances] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({ _id: "", emp_achievement: "" });
    const navigate = useNavigate();

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/Performance/get?uId=${user._id}&page=${currentPage}&perPage=${perPage}`,
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

    useEffect(() => {
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const updateAchievement = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/Performance/update`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(selectedData),
                }
            );

            if (!response.ok) {
                setLoading(false);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            fetchPerformanceData();
            toggleModal();
        } catch (error) {
            setLoading(false);
            setMessage("Failed to fetch performance data.");
            console.error("Error fetching performance data:", error);
        }
    }

    return (
        <div>
            <Card className="card-none-border">
                <CardHeader className="bg-warning text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">
                        <i className="fa-solid fa-arrow-left back-btn-ioc"
                            onClick={() => navigate(-1)}
                        ></i>&nbsp;
                        Performance List</h3>
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
                                <th style={{ width: "5%" }}>Employee Achievement</th>
                                <th style={{ width: "5%" }}>Manager Achievement</th>
                                <th style={{ width: "20%" }}>Weighted each rating</th>
                                <th style={{ width: "30%" }}>Qualitative Feedback by Manager</th>
                                <th style={{ width: "5%" }}>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {performances.length ? (
                                performances.map((performance) => (
                                    <tr key={performance._id}>
                                        <td>{performance.employeeName}</td>
                                        <td>{performance.kpiName}</td>
                                        <td>{performance.weightage}</td>
                                        <td>{performance.goal}</td>
                                        <td>{performance.emp_achievement}</td>
                                        <td>{performance.achievement}</td>
                                        <td>{performance.average}</td>
                                        <td>{performance.remarks}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <i class="fa-solid fa-file-pen fa-lg ioc-hover-effect"
                                                onClick={() => {
                                                    setSelectedData({ _id: performance._id })
                                                    toggleModal();
                                                }}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
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

            {isModalOpen && <div className="modal-open-blur"></div>}

            <Modal isOpen={isModalOpen} toggle={toggleModal} backdrop={false} centered>
                <ModalHeader toggle={toggleModal}>Add Achievement</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={12}>
                            <Label for="emp_achievement">Employee Achievement</Label>
                            <Input
                                type="number"
                                id="emp_achievement"
                                value={selectedData.emp_achievement}
                                onChange={(e) =>
                                    setSelectedData((prevState) => ({
                                        ...prevState,
                                        emp_achievement: e.target.value,
                                    }))
                                }
                                min={0}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={updateAchievement} className="cust-btn">
                        Save
                    </Button>
                    <Button color="secondary" onClick={toggleModal} className="cust-btn-warn">
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default EmployeeReviews;
