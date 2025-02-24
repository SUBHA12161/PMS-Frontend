import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Container } from "reactstrap";
import api from "../utils/api";

const CreateCourse = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [outline, setOutline] = useState([]);
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonDescription, setLessonDescription] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const categories = [
        "Data Science",
        "Design",
        "Finance",
        "Machine Learning",
        "Marketing",
        "Mobile Development",
        "Programming",
        "Security",
        "Web Development",
    ];

    const handleImageChange = (e) => setImage(e.target.files[0]);
    const handleVideoChange = (e) => setVideo(e.target.files[0]);

    const addLessonToOutline = () => {
        if (lessonTitle && lessonDescription) {
            setOutline([...outline, { title: lessonTitle, description: lessonDescription }]);
            setLessonTitle("");
            setLessonDescription("");
        } else {
            setErrorMessage("Both lesson title and description are required.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("outline", JSON.stringify(outline));
            if (image) formData.append("image", image);
            if (video) formData.append("video", video);

            await api.post("/courses", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccessMessage("Course created successfully!");
            setTitle("");
            setDescription("");
            setPrice("");
            setCategory("");
            setOutline([]);
            setImage(null);
            setVideo(null);

            document.getElementById("image").value = "";
            document.getElementById("video").value = "";
        } catch (err) {
            setErrorMessage("Error creating course: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Container className="mt-5">
            <h2>Create a New Course</h2>
            {successMessage && <Alert color="success">{successMessage}</Alert>}
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <FormGroup>
                    <Label for="title">Course Title</Label>
                    <Input
                        type="text"
                        id="title"
                        placeholder="Enter course title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Course Description</Label>
                    <Input
                        type="textarea"
                        id="description"
                        placeholder="Enter course description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="price">Course Price</Label>
                    <Input
                        type="number"
                        id="price"
                        placeholder="Enter course price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="category">Category</Label>
                    <Input
                        type="select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="image">Course Image</Label>
                    <Input type="file" id="image" onChange={handleImageChange} accept="image/*" />
                </FormGroup>
                <FormGroup>
                    <Label for="video">Course Video</Label>
                    <Input type="file" id="video" onChange={handleVideoChange} accept="video/*" />
                </FormGroup>

                {/* Outline Section */}
                <h4>Add Course Outline</h4>
                <FormGroup>
                    <Label for="lessonTitle">Lesson Title</Label>
                    <Input
                        type="text"
                        id="lessonTitle"
                        placeholder="Enter lesson title"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="lessonDescription">Lesson Description</Label>
                    <Input
                        type="textarea"
                        id="lessonDescription"
                        placeholder="Enter lesson description"
                        value={lessonDescription}
                        onChange={(e) => setLessonDescription(e.target.value)}
                    />
                </FormGroup>
                <Button color="secondary" onClick={addLessonToOutline}>
                    Add Lesson
                </Button>
                <ul>
                    {outline.map((lesson, index) => (
                        <li key={index}>
                            <strong>{lesson.title}:</strong> {lesson.description}
                        </li>
                    ))}
                </ul>

                <Button color="primary" type="submit" className="mt-3">
                    Create Course
                </Button>
            </Form>
        </Container>
    );
};

export default CreateCourse;