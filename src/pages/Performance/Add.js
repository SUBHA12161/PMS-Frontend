import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Alert } from "reactstrap";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/css/KPI/style.css";

const KPISelectionForm = () => {
    const [kpis, setKpis] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedKpi, setSelectedKpi] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [message, setMessage] = useState("");
    const { user, logout, isTokenExpired } = useContext(AuthContext);

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const token = localStorage.getItem("token");
                if (isTokenExpired(token)) {
                    alert("Token has expired. Logging out...");
                    logout();
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/kpi/get`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setKpis(data.kpis);
            } catch (error) {
                console.error("Failed to fetch KPIs", error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem("token");
                if (isTokenExpired(token)) {
                    alert("Token has expired. Logging out...");
                    logout();
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/emp/get?managerId=${user._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setEmployees(data.employees);
            } catch (error) {
                console.error("Failed to fetch employees", error);
            }
        };

        fetchKpis();
        fetchEmployees();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedKpi || !selectedEmployee) {
            setMessage("Please select both KPI and Employee.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Performance/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    kpiId: selectedKpi.value,
                    employeeId: selectedEmployee.value,
                    remarks,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to save data");

            setMessage("Performance saved successfully!");
            setSelectedKpi(null);
            setSelectedEmployee(null);
            setRemarks("");
        } catch (error) {
            setMessage(error.message || "An error occurred while saving.");
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: "0.3rem",
        }),
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card className="shadow-sm" style={{ width: "450px" }}>
                <CardHeader className="bg-warning text-white">
                    <h5>Select KPI and Employee</h5>
                </CardHeader>
                <CardBody>
                    {message && (
                        <Alert
                            color={message.includes("successfully") ? "success" : "danger"}
                        >
                            {message}
                        </Alert>
                    )}
                    <Form onSubmit={handleSave} style={{ textAlign: "left" }}>
                        <FormGroup className="w-100">
                            <Label for="employee">Employee</Label>
                            <Select
                                id="employee"
                                options={employees.map((emp) => ({
                                    value: emp._id,
                                    label: emp.name,
                                }))}
                                value={selectedEmployee}
                                onChange={setSelectedEmployee}
                                styles={customStyles}
                                placeholder="Select Employee"
                            />
                        </FormGroup>
                        <FormGroup className="w-100">
                            <Label for="kpi">KPI</Label>
                            <Select
                                id="kpi"
                                options={kpis.map((kpi) => ({
                                    value: kpi._id,
                                    label: kpi.name,
                                    weightage: kpi.weightage,
                                    goal: kpi.goal,
                                }))}
                                value={selectedKpi}
                                onChange={setSelectedKpi}
                                styles={customStyles}
                                placeholder="Select KPI"
                            />
                        </FormGroup>
                        {selectedKpi && (
                            <>
                                <FormGroup className="w-100">
                                    <Label for="weightage">Weightage</Label>
                                    <Input
                                        type="number"
                                        id="weightage"
                                        value={selectedKpi.weightage}
                                        disabled
                                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                                    />
                                </FormGroup>
                                <FormGroup className="w-100">
                                    <Label for="goal">Goal</Label>
                                    <Input
                                        type="number"
                                        id="goal"
                                        value={selectedKpi.goal}
                                        disabled
                                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                                    />
                                </FormGroup>
                            </>
                        )}
                        <FormGroup className="w-100">
                            <Label for="remarks">Remarks</Label>
                            <Input
                                type="textarea"
                                id="remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                style={{ resize: "vertical", padding: "0.5rem", fontSize: "1rem" }}
                                placeholder="Add your remarks"
                            />
                        </FormGroup>
                        <button type="submit" className="btn btn-primary w-100 mt-3 mb-3 cust-btn">
                            Save
                        </button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default KPISelectionForm;