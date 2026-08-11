# 📚 NPTEL Study Assistant

An AI-powered NPTEL quiz platform that generates personalized questions by topic and difficulty, evaluates performance in real time, and helps students identify areas that need improvement.

🌐 **Live Demo:** [nptel-study-assistant-1.onrender.com](https://nptel-study-assistant-1.onrender.com)
💻 **GitHub:** [github.com/SaiRupesh07/NPTEL-Study-Assistant](https://github.com/SaiRupesh07/NPTEL-Study-Assistant)

---

## 🎯 Overview

**NPTEL Study Assistant** is a web-based learning and quiz platform designed to help students prepare for NPTEL courses through interactive practice.

The project started as a traditional year-wise and unit-wise question practice application and was later enhanced with an **AI-powered quiz generation system**.

Students can:

- Select an NPTEL course
- Practice previous-year questions
- Practice questions unit-wise or year-wise
- Select a specific topic
- Choose quiz difficulty
- Generate questions dynamically using AI
- Answer questions interactively
- Receive immediate feedback
- View final performance statistics
- Identify topics that need more practice

The application uses a **React + Vite** frontend, a **FastAPI** backend, and the **Groq LLM API** for dynamic question generation.

---

## ✨ Key Features

### 📖 Course Selection

The platform currently supports four NPTEL-oriented courses:

- ☁️ Cloud Computing
- 🌐 Computer Networks & Protocols
- 📊 Data Analytics with Python
- 🧠 Affective Computing

### 📅 Year-Wise Practice

Students can select a specific year and practice questions across multiple units.

- Randomized questions
- Interactive answer selection
- Real-time scoring
- Answer validation
- Question navigation
- Explanations for answers

### 📑 Unit-Wise Practice

Students can focus on a particular unit and practice questions collected across multiple years — useful for targeted preparation on individual portions of a course.

### 🤖 AI-Generated Quiz

The major enhancement of the project is the AI-powered quiz generation system. Students select:

- Course
- Topic
- Difficulty
- Number of questions

The backend sends the request to the Groq LLM and generates structured NPTEL-style multiple-choice questions, each containing:

- Question text
- Options A–D
- Correct answer
- Topic
- Explanation

**Example request:**

| Field | Value |
|---|---|
| Course | Computer Networks & Protocols |
| Topic | Routing |
| Difficulty | Medium |
| Questions | 5 |

**AI question generation flow:**

```
User selects course → topic → difficulty → number of questions
        │
        ▼
React Frontend  ──POST /api/generate-quiz──▶  FastAPI Backend
        │
        ▼
Groq LLM  ──▶  Structured Quiz JSON
        │
        ▼
React Quiz Interface → Answer Evaluation → Performance Result
```

### 🎮 Interactive Quiz System

- Question-by-question navigation
- Answer selection
- "Check Answer" functionality
- Correct/incorrect indication
- Explanation after answering
- Previous/Next navigation
- Progress tracking
- Live score tracking

### 📊 Performance Analysis

After completing a quiz, students see a dedicated results screen with:

- 🎯 Overall percentage
- ✅ Correct answers
- ❌ Incorrect answers
- ⏭️ Unanswered questions
- 📚 Topic breakdown
- 🔄 Try Again / 🏠 Back to Home options

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, React Bootstrap, React Feather, JavaScript, CSS |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic, python-dotenv |
| **AI** | Groq API (LLM-based question generation) |
| **Deployment** | Render Static Site (frontend), Render Web Service (backend) |
| **Version Control** | Git, GitHub |

---

## 🏗️ Project Architecture

```
NPTEL-Study-Assistant/
│
├── backend/
│   ├── main.py
│   ├── .env.example
│   └── venv/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── data/
│   │   ├── affectiveComputing.js
│   │   ├── cloudComputing.js
│   │   ├── computerNetworks.js
│   │   └── dataAnalytics.js
│   │
│   ├── pages/
│   │   ├── AIQuiz.jsx
│   │   ├── CourseSelect.jsx
│   │   ├── QuizPage.jsx
│   │   ├── QuizResult.jsx
│   │   ├── UnitWise.jsx
│   │   └── YearWise.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🔌 Backend API

### Root

`GET /` — Returns the API status.

### Health Check

`GET /health` — Verifies that the backend service is running.

### AI Quiz Generation

`POST /api/generate-quiz`

**Request**

```json
{
  "course": "Cloud Computing",
  "topic": "Virtualization",
  "difficulty": "medium",
  "number_of_questions": 5
}
```

**Response**

```json
{
  "questions": [
    {
      "id": "Q1",
      "question": "What is the primary benefit of server virtualization?",
      "options": [
        "Increased hardware cost",
        "Improved resource utilization",
        "Decreased scalability",
        "Higher power consumption"
      ],
      "answer": 1,
      "topic": "Virtualization",
      "explanation": "Virtualization allows multiple virtual machines to share physical resources efficiently."
    }
  ]
}
```

---

## 🔐 Environment Variables

### Backend

The Groq API key is stored only on the backend.

Create `backend/.env`:

```
GROQ_API_KEY=your_groq_api_key_here
```

The repository includes `backend/.env.example` as a template. The actual `.env` file must never be committed to GitHub.

### Frontend

For local development, the frontend uses an environment variable for the backend API.

Create `.env` in the project root:

```
VITE_API_URL=http://127.0.0.1:8000
```

For production, configure the Render environment variable as:

```
VITE_API_URL=https://nptel-study-assistant.onrender.com
```

This allows the same frontend codebase to work with both local and production backends.

---

## 🚀 Local Development

### Prerequisites

- Node.js
- npm
- Python 3.x
- Git

### 1. Clone the repository

```bash
git clone https://github.com/SaiRupesh07/NPTEL-Study-Assistant.git
cd NPTEL-Study-Assistant
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure frontend environment

Create `.env` in the project root:

```
VITE_API_URL=http://127.0.0.1:8000
```

### 4. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment (Windows):

```bash
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install fastapi uvicorn groq python-dotenv
```

### 5. Configure the Groq API key

Create `backend/.env`:

```
GROQ_API_KEY=your_api_key_here
```

### 6. Start the backend

From the `backend` directory:

```bash
uvicorn main:app --reload --port 8000
```

- Backend: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`

### 7. Start the frontend

In a new terminal, from the project root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`

---

## 🧪 Testing the AI API

1. Open the interactive API docs at `http://127.0.0.1:8000/docs`
2. Select `POST /api/generate-quiz`
3. Try an example request:

```json
{
  "course": "Computer Networks & Protocols",
  "topic": "Routing",
  "difficulty": "medium",
  "number_of_questions": 5
}
```

4. Click **Execute** — the backend returns a structured list of AI-generated questions.

---

## ☁️ Deployment

The project is deployed using **Render**.

**Frontend** — deployed as a Render Static Site

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Production env var: `VITE_API_URL=https://nptel-study-assistant.onrender.com`

**Backend** — deployed as a Render Web Service

- Uses the Groq API key through a secure environment variable
- Production API: `https://nptel-study-assistant.onrender.com`

---

## 🔒 Security

The project follows basic API key security practices:

- API keys are **never** stored in React source code, the GitHub repository, frontend environment variables, or public documentation
- The Groq API key is stored only in the backend environment

`.gitignore` includes:

```
.env
backend/.env
backend/venv/
__pycache__/
node_modules/
dist/
```

---

## 📱 Responsive Design

The application works across desktop, laptop, mobile, and tablet. React Bootstrap provides responsive layout components, while custom CSS handles application-specific styling.

---

## ⚡ Performance

The app uses Vite for fast development and production builds (`npm run build`), and the generated static assets are served through Render. AI functionality is handled separately by the FastAPI backend.

---

## 🔄 Application Workflow

```
                     Home
                       │
                       ▼
                Select Course
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Year-Wise       Unit-Wise        AI Quiz
        │              │              │
        │              │              ▼
        │              │        Select Topic
        │              │              │
        │              │              ▼
        │              │        Select Difficulty
        │              │              │
        │              │              ▼
        │              │        Generate Quiz
        │              │              │
        └──────────────┴──────────────┘
                       │
                       ▼
                   Quiz Page
                       │
                       ▼
                Answer Questions
                       │
                       ▼
                Evaluate Answers
                       │
                       ▼
                 Quiz Results
```

---

## 🧠 Technical Highlights

1. **Component-Based UI** — the frontend is split into reusable pages (`CourseSelect`, `AIQuiz`, `YearWise`, `UnitWise`, `QuizPage`, `QuizResult`) for modularity.
2. **State Management** — React `useState` manages selected course, practice mode, quiz data, current question, selected answers, score, and completion state.
3. **REST API Communication** — the frontend talks to FastAPI over HTTP:

   ```js
   fetch(`${API_URL}/api/generate-quiz`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ course, topic, difficulty, number_of_questions })
   });
   ```

4. **AI Integration** — the backend receives structured quiz parameters, constructs an AI prompt, sends it to Groq, and converts the response into structured quiz data for the frontend.
5. **CORS Configuration** — since frontend and backend are deployed separately, FastAPI is configured to allow requests from both the production Render frontend and the local dev environment.

---

## 🐛 Error Handling

The application handles common failure scenarios gracefully, including:

- No topic selected
- Failed API request
- AI generation failure
- Empty or invalid AI response
- Network errors

Users receive clear error messages instead of the app silently failing.

---

## 🔮 Future Improvements

- ⏱️ Timed quizzes
- 📊 Detailed performance analytics
- 📈 Progress history
- 👤 User authentication
- 💾 Persistent quiz history
- 🏆 Leaderboards
- 📚 More NPTEL courses
- 🎯 Adaptive difficulty
- 🤖 AI-generated weak-topic recommendations
- 🔁 Automatic personalized revision quizzes
- 📑 Export quiz results as PDF
- 🗃️ Database-backed user profiles
- 📱 Progressive Web App support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add new feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request

---

## 📄 License

This project is intended for educational and learning purposes.

---

## 👨‍💻 Author

**Devarinti Sai Rupesh**
B.Tech Computer Science & Engineering, NIT Patna | 2026 Graduate

Interested in: AI/ML · Generative AI · Full-Stack Development · Backend Engineering · LLM Applications

---

## ❤️ Acknowledgements

- NPTEL for providing valuable educational content
- Groq for LLM API access
- FastAPI for the backend framework
- React for the frontend framework
- Vite for the frontend build tooling
- Bootstrap for responsive UI components
- React Feather for icons
- Render for application deployment

---

⭐ If you find this project useful, consider starring the repository and sharing feedback!

Built with ❤️ by **Devarinti Sai Rupesh**
