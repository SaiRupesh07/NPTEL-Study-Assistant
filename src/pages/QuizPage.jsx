import React, { useMemo, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";

import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
  Award,
  RotateCcw,
} from "react-feather";

// ============================================================
// COURSE DATA
// ============================================================

import cloudComputing from "../data/cloudComputing";
import computerNetworks from "../data/computerNetworks";
import dataAnalytics from "../data/dataAnalytics";
import affectiveComputing from "../data/affectiveComputing";

// Map course IDs to question data
const allCourses = {
  "cloud-computing": cloudComputing,
  "computer-networks": computerNetworks,
  "data-analytics": dataAnalytics,
  "affective-computing": affectiveComputing,
};

// Course titles
const courseTitles = {
  "cloud-computing": "Cloud Computing",
  "computer-networks": "Computer Networks & Protocols",
  "data-analytics": "Data Analytics with Python",
  "affective-computing": "Affective Computing",
};

// Course theme colors
const courseColors = {
  "cloud-computing": "primary",
  "computer-networks": "info",
  "data-analytics": "success",
  "affective-computing": "secondary",
};

// ============================================================
// HELPER
// ============================================================

const arraysEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);

  return sortedA.every(
    (value, index) => value === sortedB[index]
  );
};

// ============================================================
// QUIZ PAGE
// ============================================================

const QuizPage = ({ quizData, onBackToHome }) => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [userAnswers, setUserAnswers] = useState({});

  const [checked, setChecked] = useState(false);

  const [isCorrect, setIsCorrect] = useState(null);

  const [quizCompleted, setQuizCompleted] = useState(false);

  // ==========================================================
  // QUIZ DATA
  // ==========================================================

  const selectedCourse = quizData?.selectedCourse;

  const selectedYear = quizData?.selectedYear;

  const selectedUnits = quizData?.selectedUnits;

  const selectedUnit = quizData?.selectedUnit;

  const selectedYears = quizData?.selectedYears;

  const mode = quizData?.mode;

  const aiQuestions = quizData?.questions;

  const selectedTopic = quizData?.selectedTopic;

  const difficulty = quizData?.difficulty;

  // Static course questions
  const questionsData = allCourses[selectedCourse];

  // Course color
  const courseColor =
    courseColors[selectedCourse] || "primary";

  // Course title
  const courseTitle =
    courseTitles[selectedCourse] ||
    selectedCourse?.replace(/-/g, " ") ||
    "NPTEL Quiz";

  // ==========================================================
  // PREPARE QUESTIONS
  // ==========================================================
  //
  // IMPORTANT:
  // No useEffect + setState is used here.
  //
  // This prevents the previous:
  // "Maximum update depth exceeded"
  //
  // problem.
  // ==========================================================

  const quizQuestions = useMemo(() => {
    let questions = [];

    // --------------------------------------------------------
    // AI GENERATED QUIZ
    // --------------------------------------------------------

    if (mode === "ai") {
      if (Array.isArray(aiQuestions)) {
        questions = [...aiQuestions];
      }
    }

    // --------------------------------------------------------
    // YEAR-WISE PRACTICE
    // --------------------------------------------------------

    else if (mode === "year-wise") {
      const units = Array.isArray(selectedUnits)
        ? selectedUnits
        : [];

      units.forEach((unit) => {
        const unitQuestions =
          questionsData?.[selectedYear]?.[unit] || [];

        questions.push(...unitQuestions);
      });
    }

    // --------------------------------------------------------
    // UNIT-WISE PRACTICE
    // --------------------------------------------------------

    else if (mode === "unit-wise") {
      const years = Array.isArray(selectedYears)
        ? selectedYears
        : [];

      years.forEach((year) => {
        const unitQuestions =
          questionsData?.[year]?.[selectedUnit] || [];

        questions.push(...unitQuestions);
      });
    }

    // --------------------------------------------------------
    // RETURN QUESTIONS
    // --------------------------------------------------------
    //
    // Do NOT shuffle here.
    //
    // Keeping the array stable prevents unnecessary
    // re-renders and makes AI quiz order predictable.
    // --------------------------------------------------------

    return questions;
  }, [
    mode,
    aiQuestions,
    selectedYear,
    selectedUnits,
    selectedUnit,
    selectedYears,
    questionsData,
  ]);

  // ==========================================================
  // SCORE
  // ==========================================================

  const score = useMemo(() => {
    let correct = 0;

    Object.keys(userAnswers).forEach((questionId) => {
      const question = quizQuestions.find(
        (q) => String(q.id) === String(questionId)
      );

      if (!question) {
        return;
      }

      const correctAnswer = question.answer;

      const userAnswer = userAnswers[questionId];

      if (Array.isArray(correctAnswer)) {
        if (arraysEqual(correctAnswer, userAnswer)) {
          correct++;
        }
      } else {
        if (userAnswer === correctAnswer) {
          correct++;
        }
      }
    });

    return correct;
  }, [userAnswers, quizQuestions]);

  // ==========================================================
  // QUESTION STATISTICS
  // ==========================================================

  const totalQuestions = quizQuestions.length;

  const answeredQuestions =
    Object.keys(userAnswers).length;

  const incorrectQuestions =
    answeredQuestions - score;

  const unansweredQuestions =
    totalQuestions - answeredQuestions;

  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  // ==========================================================
  // CURRENT QUESTION
  // ==========================================================

  const currentQuestion =
    quizQuestions[currentQuestionIndex];

  const userAnswer = currentQuestion
    ? userAnswers[currentQuestion.id]
    : undefined;

  // ==========================================================
  // OPTION CLICK
  // ==========================================================

  const handleOptionClick = (optionIndex) => {
    if (!currentQuestion || checked) {
      return;
    }

    const questionId = currentQuestion.id;

    const correctAnswer = currentQuestion.answer;

    // --------------------------------------------------------
    // MULTIPLE CHOICE
    // --------------------------------------------------------

    if (Array.isArray(correctAnswer)) {
      const currentAnswers = Array.isArray(userAnswer)
        ? userAnswer
        : [];

      const updatedAnswers =
        currentAnswers.includes(optionIndex)
          ? currentAnswers.filter(
              (index) => index !== optionIndex
            )
          : [...currentAnswers, optionIndex];

      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: updatedAnswers,
      }));
    }

    // --------------------------------------------------------
    // SINGLE CHOICE
    // --------------------------------------------------------

    else {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: optionIndex,
      }));
    }

    setChecked(false);
    setIsCorrect(null);
  };

  // ==========================================================
  // CHECK ANSWER
  // ==========================================================

  const handleCheckAnswer = () => {
    if (!currentQuestion) {
      return;
    }

    const correctAnswer = currentQuestion.answer;

    const answer =
      userAnswers[currentQuestion.id];

    // --------------------------------------------------------
    // NO ANSWER
    // --------------------------------------------------------

    if (
      answer === undefined ||
      (Array.isArray(correctAnswer) &&
        (!Array.isArray(answer) || answer.length === 0))
    ) {
      alert(
        "Please select an option before checking."
      );

      return;
    }

    // --------------------------------------------------------
    // CHECK ANSWER
    // --------------------------------------------------------

    const correct = Array.isArray(correctAnswer)
      ? arraysEqual(correctAnswer, answer)
      : answer === correctAnswer;

    setIsCorrect(correct);
    setChecked(true);
  };

  // ==========================================================
  // NEXT QUESTION
  // ==========================================================

  const handleNext = () => {
    if (
      currentQuestionIndex <
      quizQuestions.length - 1
    ) {
      setCurrentQuestionIndex(
        (prev) => prev + 1
      );

      setChecked(false);
      setIsCorrect(null);
    }
  };

  // ==========================================================
  // PREVIOUS QUESTION
  // ==========================================================

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (prev) => prev - 1
      );

      setChecked(false);
      setIsCorrect(null);
    }
  };

  // ==========================================================
  // FINISH QUIZ
  // ==========================================================

  const handleFinishQuiz = () => {
    if (!checked) {
      alert(
        "Please check your answer before finishing the quiz."
      );

      return;
    }

    setQuizCompleted(true);
  };

  // ==========================================================
  // RESTART QUIZ
  // ==========================================================

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setChecked(false);
    setIsCorrect(null);
    setQuizCompleted(false);
  };

  // ==========================================================
  // INVALID QUIZ DATA
  // ==========================================================

  if (!quizData) {
    return (
      <Container className="text-center mt-5">
        <Card className="shadow-sm border-0 p-4">

          <HelpCircle
            size={48}
            className="text-danger mx-auto mb-3"
          />

          <h4>
            Invalid quiz data. Please go back and
            try again.
          </h4>

          <Button
            className="mt-3 mx-auto"
            style={{ maxWidth: "200px" }}
            onClick={onBackToHome}
          >
            Back to Home
          </Button>

        </Card>
      </Container>
    );
  }

  // ==========================================================
  // NO QUESTIONS
  // ==========================================================

  if (quizQuestions.length === 0) {
    return (
      <Container className="text-center mt-5">

        <Card className="shadow-sm border-0 p-4">

          <HelpCircle
            size={48}
            className="text-warning mx-auto mb-3"
          />

          <h4>
            No questions found.
          </h4>

          {mode === "ai" ? (
            <>
              <p className="text-muted">
                The AI quiz did not return any
                questions.
              </p>

              <p className="text-muted small">
                Please try generating the quiz again
                with a different topic or number of
                questions.
              </p>
            </>
          ) : (
            <p className="text-muted">
              Try selecting different units or years.
            </p>
          )}

          <Button
            className="mt-3 mx-auto"
            style={{ maxWidth: "200px" }}
            onClick={onBackToHome}
          >
            Back to Home
          </Button>

        </Card>

      </Container>
    );
  }

  // ==========================================================
  // RESULT SCREEN
  // ==========================================================

  if (quizCompleted) {
    let resultMessage = "Keep practicing!";

    if (percentage >= 90) {
      resultMessage = "Excellent performance! 🎉";
    } else if (percentage >= 75) {
      resultMessage = "Great job! 👏";
    } else if (percentage >= 50) {
      resultMessage = "Good effort! Keep improving. 💪";
    } else {
      resultMessage =
        "Keep practicing and try again. 📚";
    }

    return (
      <Container className="py-5">

        <Card className="shadow-sm border-0">

          {/* Result Header */}

          <Card.Header
            className={`bg-${courseColor} bg-opacity-10 text-center py-4`}
          >
            <Award
              size={52}
              className={`text-${courseColor} mb-2`}
            />

            <h2 className="mb-1">
              Quiz Completed!
            </h2>

            <p className="text-muted mb-0">
              {courseTitle}
            </p>
          </Card.Header>

          {/* Result Body */}

          <Card.Body className="p-4">

            <div className="text-center mb-4">

              <div
                className={`display-3 fw-bold text-${courseColor}`}
              >
                {percentage}%
              </div>

              <h4 className="mb-1">
                {resultMessage}
              </h4>

              {mode === "ai" && (
                <p className="text-muted mb-0">
                  🤖 AI Quiz
                  {selectedTopic
                    ? ` • ${selectedTopic}`
                    : ""}
                  {difficulty
                    ? ` • ${difficulty}`
                    : ""}
                </p>
              )}

            </div>

            {/* Score */}

            <Row className="g-3 mb-4">

              <Col xs={12} md={3}>
                <Card className="h-100 border-0 bg-light text-center">
                  <Card.Body>
                    <h3 className="mb-1">
                      {score}
                    </h3>
                    <small className="text-muted">
                      Correct
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={3}>
                <Card className="h-100 border-0 bg-light text-center">
                  <Card.Body>
                    <h3 className="mb-1">
                      {incorrectQuestions}
                    </h3>
                    <small className="text-muted">
                      Incorrect
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={3}>
                <Card className="h-100 border-0 bg-light text-center">
                  <Card.Body>
                    <h3 className="mb-1">
                      {unansweredQuestions}
                    </h3>
                    <small className="text-muted">
                      Unanswered
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={3}>
                <Card className="h-100 border-0 bg-light text-center">
                  <Card.Body>
                    <h3 className="mb-1">
                      {totalQuestions}
                    </h3>
                    <small className="text-muted">
                      Total
                    </small>
                  </Card.Body>
                </Card>
              </Col>

            </Row>

            {/* Progress */}

            <div className="mb-4">

              <div className="d-flex justify-content-between mb-2">

                <span className="text-muted">
                  Overall Score
                </span>

                <strong>
                  {score}/{totalQuestions}
                </strong>

              </div>

              <ProgressBar
                now={percentage}
                variant={courseColor}
                style={{ height: "10px" }}
              />

            </div>

            {/* Buttons */}

            <div className="d-flex justify-content-center gap-3 flex-wrap">

              <Button
                variant="outline-secondary"
                onClick={handleRestartQuiz}
                className="d-flex align-items-center"
              >
                <RotateCcw
                  size={18}
                  className="me-2"
                />

                Try Again
              </Button>

              <Button
                variant={courseColor}
                onClick={onBackToHome}
                className="d-flex align-items-center"
              >
                <Home
                  size={18}
                  className="me-2"
                />

                Back to Home
              </Button>

            </div>

          </Card.Body>

          {/* Footer */}

          <Card.Footer className="bg-white border-top text-center py-3">

            <small className="text-muted">
              Made with{" "}
              <span className="text-danger">
                ❤️
              </span>{" "}
              by{" "}
              <strong>
                Devarinti Sai Rupesh
              </strong>
            </small>

          </Card.Footer>

        </Card>

      </Container>
    );
  }

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progress =
    ((currentQuestionIndex + 1) /
      quizQuestions.length) *
    100;

  const isLastQuestion =
    currentQuestionIndex ===
    quizQuestions.length - 1;

  // ==========================================================
  // RENDER QUIZ
  // ==========================================================

  return (
    <Container className="py-4">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

        <div>

          <h5 className="mb-0">
            Question{" "}
            {currentQuestionIndex + 1}{" "}
            of{" "}
            {quizQuestions.length}
          </h5>

          {mode === "ai" && (
            <small className="text-muted">

              🤖 AI Quiz

              {selectedTopic
                ? ` • ${selectedTopic}`
                : ""}

              {difficulty
                ? ` • ${difficulty}`
                : ""}

            </small>
          )}

          {mode === "year-wise" && (
            <small className="text-muted">
              📅 Year-Wise Practice
            </small>
          )}

          {mode === "unit-wise" && (
            <small className="text-muted">
              📚 Unit-Wise Practice
            </small>
          )}

        </div>

        <div className="d-flex align-items-center">

          <span className="me-3">
            Score:{" "}
            <strong>
              {score}/{totalQuestions}
            </strong>
          </span>

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onBackToHome}
          >
            <Home
              size={16}
              className="me-1"
            />

            Home
          </Button>

        </div>

      </div>

      {/* ======================================================
          PROGRESS BAR
      ======================================================= */}

      <ProgressBar
        now={progress}
        variant={courseColor}
        className="mb-4 shadow-sm"
        style={{ height: "8px" }}
      />

      {/* ======================================================
          QUESTION CARD
      ======================================================= */}

      <Card className="shadow-sm border-0 mb-4">

        {/* Question Header */}

        <Card.Header
          className={`bg-${courseColor} bg-opacity-10 py-3`}
        >

          <h5 className="mb-0">

            <strong>
              Q{currentQuestionIndex + 1}:
            </strong>{" "}

            {currentQuestion.question}

          </h5>

        </Card.Header>

        {/* Question Body */}

        <Card.Body className="px-4 py-3">

          {/* ==================================================
              OPTIONS
          ================================================== */}

          <div className="mb-3">

            {currentQuestion.options.map(
              (option, index) => {

                const isSelected =
                  Array.isArray(userAnswer)
                    ? userAnswer.includes(index)
                    : userAnswer === index;

                const isCorrectOption =
                  Array.isArray(
                    currentQuestion.answer
                  )
                    ? currentQuestion.answer.includes(
                        index
                      )
                    : currentQuestion.answer ===
                      index;

                let variant =
                  "outline-secondary";

                let iconElement = null;

                // ------------------------------------------------
                // AFTER CHECKING
                // ------------------------------------------------

                if (checked) {

                  // Correct option

                  if (isCorrectOption) {

                    variant = "success";

                    iconElement = (
                      <CheckCircle
                        size={18}
                        className="text-white"
                      />
                    );

                  }

                  // Wrong selected option

                  else if (
                    isSelected &&
                    !isCorrectOption
                  ) {

                    variant = "danger";

                    iconElement = (
                      <XCircle
                        size={18}
                        className="text-white"
                      />
                    );

                  }

                }

                // ------------------------------------------------
                // BEFORE CHECKING
                // ------------------------------------------------

                else if (isSelected) {
                  variant = courseColor;
                }

                return (
                  <Button
                    key={index}
                    variant={variant}
                    className="d-flex align-items-center justify-content-between mb-2 w-100 text-start text-wrap py-2 px-3"
                    onClick={() =>
                      handleOptionClick(index)
                    }
                    disabled={checked}
                  >

                    <span>
                      {option}
                    </span>

                    {iconElement}

                  </Button>
                );
              }
            )}

          </div>

          {/* ==================================================
              EXPLANATION
          ================================================== */}

          {checked && (
            <Alert
              className="d-flex align-items-start mt-3"
              variant={
                isCorrect
                  ? "success"
                  : "danger"
              }
            >

              {isCorrect ? (
                <>
                  <CheckCircle
                    size={20}
                    className="me-2 mt-1 flex-shrink-0"
                  />

                  <div>

                    <strong>
                      Correct!
                    </strong>

                    {currentQuestion.explanation && (
                      <p className="mb-0 mt-1">
                        {currentQuestion.explanation}
                      </p>
                    )}

                  </div>
                </>
              ) : (
                <>
                  <XCircle
                    size={20}
                    className="me-2 mt-1 flex-shrink-0"
                  />

                  <div>

                    <strong>
                      Incorrect.
                    </strong>

                    {currentQuestion.explanation && (
                      <p className="mb-0 mt-1">
                        {currentQuestion.explanation}
                      </p>
                    )}

                  </div>
                </>
              )}

            </Alert>
          )}

        </Card.Body>

        {/* ======================================================
            FOOTER
        ======================================================= */}

        <Card.Footer className="bg-white py-3">

          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">

            {/* Check Answer */}

            <Button
              variant={
                checked
                  ? "outline-secondary"
                  : "warning"
              }
              className="d-flex align-items-center justify-content-center"
              onClick={handleCheckAnswer}
              disabled={checked}
            >

              <CheckCircle
                size={18}
                className="me-2"
              />

              Check Answer

            </Button>

            {/* Navigation */}

            <div className="d-flex gap-2">

              {/* Previous */}

              <Button
                variant="outline-secondary"
                className="d-flex align-items-center"
                onClick={handlePrev}
                disabled={
                  currentQuestionIndex === 0
                }
              >

                <ChevronLeft
                  size={18}
                  className="me-1"
                />

                Previous

              </Button>

              {/* Next / Finish */}

              {!isLastQuestion ? (
                <Button
                  variant={courseColor}
                  className="d-flex align-items-center"
                  onClick={handleNext}
                  disabled={!checked}
                >

                  Next

                  <ChevronRight
                    size={18}
                    className="ms-1"
                  />

                </Button>
              ) : (
                <Button
                  variant="success"
                  className="d-flex align-items-center"
                  onClick={handleFinishQuiz}
                  disabled={!checked}
                >

                  <Award
                    size={18}
                    className="me-1"
                  />

                  Finish Quiz

                </Button>
              )}

            </div>

          </div>

        </Card.Footer>

      </Card>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      <div className="text-center mt-4 pb-2">

        <small className="text-muted">
          Made with{" "}
          <span className="text-danger">
            ❤️
          </span>{" "}
          by{" "}
          <strong>
            Devarinti Sai Rupesh
          </strong>
        </small>

      </div>

    </Container>
  );
};

export default QuizPage;