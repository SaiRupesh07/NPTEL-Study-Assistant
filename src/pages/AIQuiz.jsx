import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import {
  Cpu,
  ArrowLeft,
  PlayCircle,
} from "react-feather";

// Backend API URL
// Local:  http://127.0.0.1:8000
// Render: https://your-backend.onrender.com
const API_URL = import.meta.env.VITE_API_URL;

const courseTopics = {
  "cloud-computing": [
    "Introduction to Cloud Computing",
    "Virtualization",
    "Cloud Architecture",
    "Cloud Storage",
    "Resource Management",
    "Cloud Security",
    "Load Balancing",
    "Distributed Systems",
  ],

  "computer-networks": [
    "OSI Model",
    "TCP/IP",
    "Routing",
    "Transport Layer",
    "Network Security",
    "IP Addressing",
    "Congestion Control",
    "Application Layer",
  ],

  "data-analytics": [
    "Python Basics",
    "NumPy",
    "Pandas",
    "Data Visualization",
    "Statistics",
    "Probability",
    "Machine Learning",
    "Data Preprocessing",
  ],

  "affective-computing": [
    "Introduction to Affective Computing",
    "Emotion Recognition",
    "Facial Expression Recognition",
    "Speech Emotion Recognition",
    "Human Computer Interaction",
    "Emotion Models",
    "Physiological Signals",
    "Multimodal Emotion Recognition",
  ],
};

const courseTitles = {
  "cloud-computing": "Cloud Computing",
  "computer-networks": "Computer Networks & Protocols",
  "data-analytics": "Data Analytics with Python",
  "affective-computing": "Affective Computing",
};

const AIQuiz = ({
  selectedCourse,
  onStartQuiz,
  onBack,
}) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topics = courseTopics[selectedCourse] || [];

  const handleGenerateQuiz = async () => {
    if (!topic) {
      setError("Please select a topic.");
      return;
    }

    if (!API_URL) {
      setError(
        "API URL is not configured. Please check your VITE_API_URL environment variable."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/generate-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course: courseTitles[selectedCourse],
            topic: topic,
            difficulty: difficulty,
            number_of_questions: Number(numberOfQuestions),
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to generate quiz."
        );
      }

      if (
        !data ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error("AI returned no questions.");
      }

      onStartQuiz({
        mode: "ai",
        questions: data.questions,
        selectedTopic: topic,
        difficulty: difficulty,
      });
    } catch (err) {
      console.error("AI Quiz Generation Error:", err);

      setError(
        err?.message ||
          "Something went wrong while generating the quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        {/* Header */}
        <Card.Header className="bg-primary bg-opacity-10 py-3">
          <div className="d-flex align-items-center">
            <Cpu
              size={24}
              className="text-primary me-2"
            />

            <div>
              <h4 className="mb-0">
                AI Generated Quiz
              </h4>

              <small className="text-muted">
                {courseTitles[selectedCourse]}
              </small>
            </div>
          </div>
        </Card.Header>

        {/* Body */}
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h5>
              Generate a personalized quiz
            </h5>

            <p className="text-muted">
              Choose a topic and difficulty. AI will
              generate NPTEL-style questions for you.
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <Row className="g-4">
            {/* Topic */}
            <Col xs={12}>
              <Form.Group>
                <Form.Label>
                  <strong>Select Topic</strong>
                </Form.Label>

                <Form.Select
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">
                    Choose a topic...
                  </option>

                  {topics.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Difficulty */}
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>
                  <strong>Difficulty</strong>
                </Form.Label>

                <Form.Select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Number of Questions */}
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>
                  <strong>
                    Number of Questions
                  </strong>
                </Form.Label>

                <Form.Select
                  value={numberOfQuestions}
                  onChange={(e) =>
                    setNumberOfQuestions(
                      e.target.value
                    )
                  }
                  disabled={loading}
                >
                  <option value="5">
                    5 Questions
                  </option>

                  <option value="10">
                    10 Questions
                  </option>

                  <option value="15">
                    15 Questions
                  </option>

                  <option value="20">
                    20 Questions
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft
                size={18}
                className="me-1"
              />

              Back
            </Button>

            <Button
              variant="primary"
              onClick={handleGenerateQuiz}
              disabled={loading || !topic}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />

                  Generating...
                </>
              ) : (
                <>
                  <PlayCircle
                    size={18}
                    className="me-2"
                  />

                  Generate AI Quiz
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AIQuiz;