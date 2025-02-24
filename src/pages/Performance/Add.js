import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Form,
    FormGroup,
    Label,
    Input,
    Card,
    CardBody,
    CardHeader,
    Alert,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/css/KPI/style.css";

const KPISelectionForm = () => {
    const location = useLocation();
    const empId = location.state?.id;
    const empName = location.state?.name;
    const [kpis, setKpis] = useState([]);
    const [selectedKpi, setSelectedKpi] = useState(null);
    const [weightage, setWeightage] = useState("");
    const [achievement, setAchievement] = useState("");
    const [goal, setGoal] = useState("");
    const [remarks, setRemarks] = useState("");
    const [message, setMessage] = useState("");
    const [newKpiName, setNewKpiName] = useState("");
    const [newKpiWeightage, setNewKpiWeightage] = useState("");
    const [newKpiGoal, setNewKpiGoal] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { logout, isTokenExpired } = useContext(AuthContext);
    const navigate = useNavigate();

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
            setKpis(data.kpis || []);
        } catch (error) {
            console.error("Failed to fetch KPIs", error);
        }
    };

    useEffect(() => {
        fetchKpis();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedKpi || !empId) {
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
                    employeeId: empId,
                    weightage,
                    goal,
                    remarks,
                    achievement
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to save data");

            setMessage("Performance saved successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (error) {
            setMessage(error.message || "An error occurred while saving.");
        }
    };

    const handleAddNewKpi = async () => {
        if (!newKpiName || !newKpiWeightage || !newKpiGoal) {
            setMessage("Please fill out all fields for the new KPI.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/kpi/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newKpiName,
                    weightage: newKpiWeightage,
                    goal: newKpiGoal,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to add new KPI");

            // Refresh KPI list
            await fetchKpis();
            setMessage("New KPI added successfully!");
            setIsModalOpen(false);
            setNewKpiName("");
            setNewKpiWeightage("");
            setNewKpiGoal("");
        } catch (error) {
            setMessage(error.message || "An error occurred while adding the KPI.");
        }
    };

    const handleKpiChange = (selectedOption) => {
        setSelectedKpi(selectedOption);
        setWeightage(selectedOption?.weightage || "");
        setGoal(selectedOption?.goal || "");
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: "0.3rem",
        }),
    };

    return (
        <div>
            <Card className="card-none-border">
                <CardHeader className="bg-warning text-white">
                    <h3 className="mb-0">
                        <i className="fa-solid fa-arrow-left back-btn-ioc"
                            onClick={() => navigate(-1)}
                        ></i>&nbsp;
                        Add Performance
                    </h3>
                </CardHeader>
                <CardBody>
                    {message && (
                        <Alert
                            color={message.includes("successfully") ? "success" : "danger"}
                        >
                            {message}
                        </Alert>
                    )}
                    <Form onSubmit={handleSave} style={{ textAlign: 'left' }}>
                        <Row>
                            <Col md={12}>
                                <FormGroup className="col-md-12">
                                    <Label for="kpi">KPI</Label>
                                    <Select
                                        id="kpi"
                                        options={[
                                            ...kpis.map((kpi) => ({
                                                value: kpi._id,
                                                label: kpi.name,
                                                weightage: kpi.weightage,
                                                goal: kpi.goal,
                                            })),
                                            { value: "addNew", label: "Add New KPI" },
                                        ]}
                                        value={selectedKpi}
                                        onChange={(option) =>
                                            option.value === "addNew"
                                                ? toggleModal()
                                                : handleKpiChange(option)
                                        }
                                        styles={customStyles}
                                        placeholder="Select KPI"
                                    />
                                </FormGroup>
                            </Col>
                            {selectedKpi && selectedKpi.value !== "addNew" && (
                                <>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="weightage">Weightage</Label>
                                            <Input
                                                type="number"
                                                id="weightage"
                                                value={weightage}
                                                onChange={(e) => setWeightage(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="goal">Goal</Label>
                                            <Input
                                                type="number"
                                                id="goal"
                                                value={goal}
                                                onChange={(e) => setGoal(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </>
                            )}
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="empName">Employee Name</Label>
                                    <Input
                                        type="text"
                                        id="empName"
                                        value={empName}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="achievement">Achievement ( Manager )</Label>
                                    <Input
                                        type="number"
                                        id="achievement"
                                        value={achievement}
                                        onChange={(e) => setAchievement(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <FormGroup>
                                <Label for="remarks">Remarks</Label>
                                <Input
                                    type="textarea"
                                    id="remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    style={{ resize: "vertical" }}
                                    placeholder="Add your remarks"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-30 mt-3 cust-btn"
                                    style={{ float: 'right' }}
                                >
                                    Save
                                </Button>
                            </FormGroup>
                        </Row>
                    </Form>
                </CardBody>
            </Card>

            {isModalOpen && <div className="modal-open-blur"></div>}

            <Modal isOpen={isModalOpen} toggle={toggleModal} backdrop={false} centered>
                <ModalHeader toggle={toggleModal}>Add New KPI</ModalHeader>
                <ModalBody>
                    <Form style={{ textAlign: 'left' }}>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="newKpiName">KPI Name</Label>
                                    <Input
                                        type="textarea"
                                        id="newKpiName"
                                        value={newKpiName}
                                        onChange={(e) => setNewKpiName(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="newKpiWeightage">Weightage</Label>
                                    <Input
                                        type="number"
                                        id="newKpiWeightage"
                                        value={newKpiWeightage}
                                        onChange={(e) => setNewKpiWeightage(e.target.value)}
                                        min={0}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="newKpiGoal">Goal</Label>
                                    <Input
                                        type="number"
                                        id="newKpiGoal"
                                        value={newKpiGoal}
                                        onChange={(e) => setNewKpiGoal(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleAddNewKpi} className="cust-btn">
                        Save KPI
                    </Button>
                    <Button color="secondary" onClick={toggleModal} className="cust-btn-warn">
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default KPISelectionForm;