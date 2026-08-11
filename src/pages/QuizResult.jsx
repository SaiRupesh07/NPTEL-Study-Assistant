import React, { useMemo } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ProgressBar,
  Badge,
} from "react-bootstrap";

import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  RefreshCw,
  Home,
  TrendingUp,
} from "react-feather";

const courseTitles = {
  "cloud-computing": "Cloud Computing",
  "computer-networks": "Computer Networks & Protocols",
  "data-analytics": "Data Analytics with Python",
  "affective-computing": "Affective Computing",
};

const QuizResult = ({
  quizData,
  questions,
  userAnswers,
  onRetry,
  onBackToHome,
}) => {
  // ==========================================================
  // CALCULATE RESULTS
  // ==========================================================

  const results = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const topicStats = {};

    questions.forEach((question) => {
      const questionId = question.id;
      const userAnswer = userAnswers[questionId];

      const topic =
        question.topic ||
        quizData.selectedTopic ||
        "General";

      if (!topicStats[topic]) {
        topicStats[topic] = {
          total: 0,
          correct: 0,
          wrong: 0,
          unanswered: 0,
        };
      }

      topicStats[topic].total++;

      // --------------------------------------------------------
      // UNANSWERED
      // --------------------------------------------------------

      if (
        userAnswer === undefined ||
        userAnswer === null ||
        (
          Array.isArray(userAnswer) &&
          userAnswer.length === 0
        )
      ) {
        unanswered++;
        topicStats[topic].unanswered++;
        return;
      }

      // --------------------------------------------------------
      // CHECK ANSWER
      // --------------------------------------------------------

      const correctAnswer = question.answer;

      let isCorrect = false;

      if (Array.isArray(correctAnswer)) {
        if (Array.isArray(userAnswer)) {
          const expected = [...correctAnswer].sort(
            (a, b) => a - b
          );

          const actual = [...userAnswer].sort(
            (a, b) => a - b
          );

          isCorrect =
            expected.length === actual.length &&
            expected.every(
              (value, index) =>
                value === actual[index]
            );
        }
      } else {
        isCorrect =
          userAnswer === correctAnswer;
      }

      if (isCorrect) {
        correct++;
        topicStats[topic].correct++;
      } else {
        wrong++;
        topicStats[topic].wrong++;
      }
    });

    const total = questions.length;

    const percentage =
      total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    return {
      correct,
      wrong,
      unanswered,
      total,
      percentage,
      topicStats,
    };
  }, [questions, userAnswers, quizData]);

  // ==========================================================
  // FIND WEAK TOPICS
  // ==========================================================

  const weakTopics = Object.entries(
    results.topicStats
  )
    .map(([topic, stats]) => {
      const percentage =
        stats.total > 0
          ? Math.round(
              (stats.correct / stats.total) * 100
            )
          : 0;

      return {
        topic,
        ...stats,
        percentage,
      };
    })
    .filter((item) => item.percentage < 60)
    .sort(
      (a, b) =>
        a.percentage - b.percentage
    );

  // ==========================================================
  // PERFORMANCE MESSAGE
  // ==========================================================

  let performanceTitle = "";
  let performanceMessage = "";

  if (results.percentage >= 80) {
    performanceTitle = "Excellent Performance! 🎉";
    performanceMessage =
      "You have a strong understanding of this topic. Keep practicing to maintain your performance.";
  } else if (results.percentage >= 60) {
    performanceTitle = "Good Performance! 👍";
    performanceMessage =
      "You have a decent understanding, but there are a few areas that need more practice.";
  } else if (results.percentage >= 40) {
    performanceTitle = "Needs Improvement 📚";
    performanceMessage =
      "You understand some concepts, but you should revise the weak areas before attempting another quiz.";
  } else {
    performanceTitle = "More Practice Needed 💪";
    performanceMessage =
      "Don't worry. Use the weak-topic recommendations below and try another quiz.";
  }

  // ==========================================================
  // COURSE TITLE
  // ==========================================================

  const courseTitle =
    courseTitles[quizData.selectedCourse] ||
    quizData.selectedCourse ||
    "NPTEL";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Container className="py-4">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Card className="border-0 shadow-sm mb-4">

        <Card.Body className="text-center py-5">

          <Award
            size={64}
            className="text-warning mb-3"
          />

          <h2 className="mb-2">
            Quiz Complete!
          </h2>

          <p className="text-muted mb-1">
            {courseTitle}
          </p>

          {quizData.selectedTopic && (
            <p className="text-muted">
              Topic:{" "}
              <strong>
                {quizData.selectedTopic}
              </strong>
            </p>
          )}

          <div className="mt-4">

            <h1 className="display-3 fw-bold mb-0">
              {results.percentage}%
            </h1>

            <p className="text-muted">
              {results.correct} out of{" "}
              {results.total} correct
            </p>

          </div>

          <ProgressBar
            now={results.percentage}
            className="mx-auto mt-3"
            style={{
              maxWidth: "500px",
              height: "12px",
            }}
          />

        </Card.Body>

      </Card>

      {/* ======================================================
          SCORE CARDS
      ====================================================== */}

      <Row className="g-3 mb-4">

        {/* Correct */}

        <Col xs={12} md={4}>

          <Card className="border-0 shadow-sm h-100">

            <Card.Body className="text-center">

              <CheckCircle
                size={36}
                className="text-success mb-2"
              />

              <h3 className="mb-1">
                {results.correct}
              </h3>

              <p className="text-muted mb-0">
                Correct Answers
              </p>

            </Card.Body>

          </Card>

        </Col>

        {/* Wrong */}

        <Col xs={12} md={4}>

          <Card className="border-0 shadow-sm h-100">

            <Card.Body className="text-center">

              <XCircle
                size={36}
                className="text-danger mb-2"
              />

              <h3 className="mb-1">
                {results.wrong}
              </h3>

              <p className="text-muted mb-0">
                Wrong Answers
              </p>

            </Card.Body>

          </Card>

        </Col>

        {/* Unanswered */}

        <Col xs={12} md={4}>

          <Card className="border-0 shadow-sm h-100">

            <Card.Body className="text-center">

              <AlertCircle
                size={36}
                className="text-warning mb-2"
              />

              <h3 className="mb-1">
                {results.unanswered}
              </h3>

              <p className="text-muted mb-0">
                Unanswered
              </p>

            </Card.Body>

          </Card>

        </Col>

      </Row>

      {/* ======================================================
          PERFORMANCE
      ====================================================== */}

      <Card className="border-0 shadow-sm mb-4">

        <Card.Header className="bg-white py-3">

          <div className="d-flex align-items-center">

            <TrendingUp
              size={20}
              className="text-primary me-2"
            />

            <h5 className="mb-0">
              Performance Analysis
            </h5>

          </div>

        </Card.Header>

        <Card.Body>

          <h4>
            {performanceTitle}
          </h4>

          <p className="text-muted">
            {performanceMessage}
          </p>

          <ProgressBar
            now={results.percentage}
            label={`${results.percentage}%`}
            className="mt-3"
            style={{ height: "25px" }}
          />

        </Card.Body>

      </Card>

      {/* ======================================================
          WEAK TOPICS
      ====================================================== */}

      <Card className="border-0 shadow-sm mb-4">

        <Card.Header className="bg-white py-3">

          <div className="d-flex align-items-center">

            <AlertCircle
              size={20}
              className="text-danger me-2"
            />

            <h5 className="mb-0">
              Weak Topics
            </h5>

          </div>

        </Card.Header>

        <Card.Body>

          {weakTopics.length === 0 ? (

            <div className="text-center py-3">

              <CheckCircle
                size={40}
                className="text-success mb-2"
              />

              <h5>
                No Major Weak Areas 🎉
              </h5>

              <p className="text-muted mb-0">
                You performed well across the
                tested topics.
              </p>

            </div>

          ) : (

            <>

              <p className="text-muted">
                These topics may need additional
                revision:
              </p>

              <Row className="g-3">

                {weakTopics.map((item) => (

                  <Col
                    xs={12}
                    md={6}
                    key={item.topic}
                  >

                    <Card
                      className="border"
                    >

                      <Card.Body>

                        <div className="d-flex justify-content-between align-items-center mb-2">

                          <strong>
                            {item.topic}
                          </strong>

                          <Badge bg="danger">
                            {item.percentage}%
                          </Badge>

                        </div>

                        <ProgressBar
                          now={item.percentage}
                          variant="danger"
                          style={{
                            height: "8px",
                          }}
                        />

                        <small className="text-muted d-block mt-2">

                          {item.correct} correct
                          out of{" "}
                          {item.total}

                        </small>

                      </Card.Body>

                    </Card>

                  </Col>

                ))}

              </Row>

            </>

          )}

        </Card.Body>

      </Card>

      {/* ======================================================
          STUDY RECOMMENDATION
      ====================================================== */}

      <Card className="border-0 shadow-sm mb-4">

        <Card.Header className="bg-white py-3">

          <div className="d-flex align-items-center">

            <BookOpen
              size={20}
              className="text-primary me-2"
            />

            <h5 className="mb-0">
              Recommended Revision
            </h5>

          </div>

        </Card.Header>

        <Card.Body>

          {weakTopics.length > 0 ? (

            <ul className="mb-0">

              {weakTopics
                .slice(0, 3)
                .map((item) => (

                  <li
                    key={item.topic}
                    className="mb-2"
                  >
                    Revise{" "}
                    <strong>
                      {item.topic}
                    </strong>{" "}
                    and practice more questions
                    from this topic.
                  </li>

                ))}

            </ul>

          ) : (

            <p className="mb-0 text-muted">

              Your performance is good. Continue
              practicing mixed questions to
              strengthen your understanding.

            </p>

          )}

        </Card.Body>

      </Card>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div className="d-flex justify-content-center gap-3 flex-wrap">

        <Button
          variant="primary"
          size="lg"
          onClick={onRetry}
          className="d-flex align-items-center"
        >

          <RefreshCw
            size={18}
            className="me-2"
          />

          Try Another Quiz

        </Button>

        <Button
          variant="outline-secondary"
          size="lg"
          onClick={onBackToHome}
          className="d-flex align-items-center"
        >

          <Home
            size={18}
            className="me-2"
          />

          Back to Courses

        </Button>

      </div>

    </Container>
  );
};

export default QuizResult;