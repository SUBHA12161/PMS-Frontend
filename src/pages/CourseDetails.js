import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Button, Progress, Collapse } from "reactstrap";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CourseDetails = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [isVideoStarted, setIsVideoStarted] = useState(false);
    const [expandedLessons, setExpandedLessons] = useState({});
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/courses/single/${courseId}`);

                setCourse(response.data.course);

                const savedProgress = localStorage.getItem(`course-${courseId}-video-progress`);
                if (savedProgress) {
                    setVideoProgress(JSON.parse(savedProgress));
                }
            } catch (error) {
                console.error("Error fetching course details", error);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleVideoProgress = (e) => {
        const video = e.target;
        const progress = Math.floor((video.currentTime / video.duration) * 100);
        const currentTime = video.currentTime;

        setVideoProgress(progress);

        localStorage.setItem(`course-${courseId}-video-progress`, JSON.stringify(progress));
        localStorage.setItem(`course-${courseId}-video-current-time`, currentTime);
    };

    const handleVideoPause = async () => {
        const progress = videoProgress;
        const currentTime = videoRef.current?.currentTime;

        try {
            await api.patch(`/courses/${courseId}/progress`, {
                videoProgress: progress,
                currentTime,
            });
        } catch (error) {
            console.error("Error updating progress", error);
        }
    };

    const handleStartVideo = () => {
        setIsVideoStarted(true);
    };

    const handleLoadedMetadata = () => {
        const savedCurrentTime = localStorage.getItem(`course-${courseId}-video-current-time`);
        if (savedCurrentTime && videoRef.current) {
            videoRef.current.currentTime = parseFloat(savedCurrentTime);
        }
    };

    const toggleLesson = (lessonId) => {
        setExpandedLessons((prev) => ({
            ...prev,
            [lessonId]: !prev[lessonId],
        }));
    };

    useEffect(() => {
        const saveProgressOnUnload = async () => {
            try {
                const progress = videoProgress;
                const currentTime = videoRef.current?.currentTime;

                await api.patch(`/courses/${courseId}/progress`, {
                    videoProgress: progress,
                    currentTime,
                });
            } catch (error) {
                console.error("Error saving progress on unload", error);
            }
        };

        window.addEventListener("beforeunload", saveProgressOnUnload);

        return () => {
            window.removeEventListener("beforeunload", saveProgressOnUnload);
            saveProgressOnUnload();
        };
    }, [courseId, videoProgress]); 

    if (!course) {
        return <p>Loading course details...</p>;
    }

    return (
        <Container className="mt-4">
            <h1>{course.title}</h1>
            <Row>
                <Col md="8">
                    <Card>
                        <CardBody>
                            <h5>Video Progress</h5>
                            <Progress value={videoProgress}>
                                {videoProgress}% Watched
                            </Progress>

                            {!isVideoStarted ? (
                                <Button color="primary mt-3" onClick={handleStartVideo}>
                                    {videoProgress > 0 ? "Resume Video" : "Start Video"}
                                </Button>
                            ) : (
                                <video
                                    id="video-player"
                                    ref={videoRef}
                                    controls
                                    width="100%"
                                    onTimeUpdate={handleVideoProgress}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onPause={handleVideoPause}
                                    style={{ marginTop: "25px" }}
                                >
                                    <source src={process.env.REACT_APP_BASE_URL + course.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card>
                        <CardBody>
                            <h5>Course Details</h5>
                            <p><strong>Description:</strong> {course.description}</p>
                            <p><strong>Price:</strong> ${course.price}</p>
                            <p><strong>Category:</strong> {course.category}</p>
                            <p><strong>Instructor:</strong> {course.instructor}</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <h3>Course Outline</h3>
                    <Card>
                        <CardBody>
                            {course.outline.map((lesson, index) => (
                                <div key={index} className="mb-3">
                                    <Button
                                        color="link"
                                        onClick={() => toggleLesson(index)}
                                        style={{ textAlign: "left", width: "100%" }}
                                    >
                                        {lesson.title}
                                    </Button>
                                    <Collapse isOpen={expandedLessons[index]}>
                                        <Card className="mt-2">
                                            <CardBody>
                                                <p>{lesson.description}</p>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CourseDetails;