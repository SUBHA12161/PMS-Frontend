import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input, Label } from "reactstrap";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({ category: "", price: "", rating: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get(`/courses`, {
                    params: {
                        page,
                        limit,
                        ...filters,
                    },
                });

                const { courses } = response.data;

                if (courses.length === 0) {
                    setHasMore(false);
                } else {
                    setCourses((prevCourses) => [...prevCourses, ...courses]);
                }
            } catch (error) {
                console.error("Error fetching courses", error);
            }
        };
        fetchCourses();
    }, [page, limit, filters]);

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
        setPage(1);
        setCourses([]);
        setHasMore(true);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1);
        setCourses([]);
        setHasMore(true);
    };

    const handleRatingChange = (e) => {
        const rating = e.target.value;
        setFilters({ ...filters, rating: rating });
        setPage(1);
        setCourses([]);
        setHasMore(true);
    };

    const handleCardClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <Container className="mt-9">
            <h1 className="text-center mb-4">Course Catalog</h1>

            <div className="mb-4 text-center">
                <Row>
                    <Col>
                        <Label for="filter-category">Category:</Label>
                        <Input
                            type="select"
                            id="filter-category"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            <option value='Data Science'>Data Science</option>
                            <option value='Design'>Design</option>
                            <option value='Finance'>Finance</option>
                            <option value='Machine Learning'>Machine Learning</option>
                            <option value='Marketing'>Marketing</option>
                            <option value='Mobile Development'>Mobile Development</option>
                            <option value='Programming'>Programming</option>
                            <option value='Security'>Security</option>
                            <option value='Web Development'>Web Developmen</option>
                        </Input>
                    </Col>
                    <Col>
                        <Label for="filter-price">Price:</Label>
                        <Input
                            type="select"
                            id="filter-price"
                            name="price"
                            value={filters.price}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                        </Input>
                    </Col>
                    <Col>
                        <Label for="filter-rating">Rating:</Label>
                        <Input
                            type="select"
                            id="filter-rating"
                            name="rating"
                            value={filters.rating}
                            onChange={handleRatingChange}
                        >
                            <option value="">All</option>
                            {[...Array(5)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {index + 1} Stars
                                </option>
                            ))}
                        </Input>
                    </Col>
                    <Col>
                        <Label for="limit-select">Courses Per Page:</Label>
                        <Input
                            type="select"
                            id="limit-select"
                            value={limit}
                            onChange={handleLimitChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </Input>
                    </Col>
                </Row>
            </div>

            <Row>
                {courses.map((course) => (
                    <Col md="4" sm="6" xs="12" className="mb-4" key={course._id}>
                        <Card onClick={() => handleCardClick(course._id)} style={{ cursor: "pointer" }}>
                            <img src={process.env.REACT_APP_BASE_URL + course.image} alt={course.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                            <CardBody>
                                <CardTitle tag="h5">{course.title}</CardTitle>
                                <CardText>
                                    <strong>Rating:</strong> {course.rating} ⭐
                                </CardText>
                                <CardText>
                                    <strong>Price:</strong> ${course.price}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {hasMore ? (
                <div className="text-center">
                    <Button color="primary" onClick={() => setPage(page + 1)}>
                        Load More
                    </Button>
                </div>
            ) : (
                <div className="text-center mt-3">
                    <p>No more courses to load.</p>
                </div>
            )}
        </Container>
    );
};

export default CourseCatalog;