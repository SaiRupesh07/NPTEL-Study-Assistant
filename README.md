# 📚 NPTEL Study Assistant

An interactive web-based quiz platform designed to help students practice NPTEL assignment questions through **year-wise and unit-wise practice modes**.

The application provides real-time answer validation, progress tracking, score calculation, explanations, randomized questions, and a responsive interface across desktop and mobile devices.

## 🚀 About the Project

I developed and maintained this project using my understanding of **HTML, CSS, JavaScript, Bootstrap, and interactive web application development**.

The project was designed with a simple and lightweight architecture so that students can practice NPTEL questions directly in the browser without requiring a backend server or external API.

### 🎯 Key Objectives

* Make NPTEL assignment practice easier and more interactive
* Organize questions by course, year, and unit
* Provide immediate feedback after answering
* Help students identify incorrect answers through explanations
* Provide a responsive experience across different devices

## ✨ Features

### 📖 Multiple NPTEL Courses

The application currently supports:

* ☁️ Cloud Computing
* 🌐 Computer Networks & Protocols
* 📊 Data Analytics with Python
* 🧠 Affective Computing

### 🎮 Practice Modes

**Year-wise Practice**

* Select a specific NPTEL assignment year
* Practice questions across selected units
* Questions are randomized for practice

**Unit-wise Practice**

* Select a specific unit
* Practice questions from multiple years
* Useful for focused topic revision

### 🧠 Interactive Quiz

* Real-time answer validation
* Score calculation
* Question progress tracking
* Detailed answer explanations
* Previous/Next question navigation
* Randomized questions
* Responsive mobile-friendly interface
* Course-specific visual themes

## 🛠️ Tech Stack

| Technology    | Purpose                                  |
| ------------- | ---------------------------------------- |
| HTML5         | Application structure                    |
| CSS3          | Styling and responsive design            |
| JavaScript    | Quiz logic and application functionality |
| Bootstrap 5.3 | Responsive UI components                 |
| Feather Icons | Interface icons                          |

## 🏗️ Application Architecture

```text
                    NPTEL Study Assistant
                            │
                            ▼
                     Course Selection
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
       Year-wise Mode                Unit-wise Mode
             │                             │
             ▼                             ▼
       Select Year                   Select Unit
             │                             │
             ▼                             ▼
       Select Units                  Select Years
             │                             │
             └──────────────┬──────────────┘
                            ▼
                      Question Engine
                            │
                            ▼
                     Interactive Quiz
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
           Answer        Validation      Score
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                       Explanation
```

## 📂 Project Structure

```text
NPTEL-Study-Assistant/
│
├── index.html
│
├── data/
│   ├── affectiveComputing.js
│   ├── cloudComputing.js
│   ├── computerNetworks.js
│   └── dataAnalytics.js
│
├── assets/
│   └── images/
│
├── README.md
└── LICENSE
```

## 🚀 Getting Started

### Prerequisites

You only need:

* A modern web browser
* VS Code or another text editor
* Python or Node.js for running a local server

### Run Locally

Clone the repository:

```bash
git clone https://github.com/SaiRupesh07/NPTEL-Study-Assistant.git
```

Navigate to the project:

```bash
cd NPTEL-Study-Assistant
```

Run a local server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## 📊 Question Data Format

Questions are organized using the following hierarchy:

```text
Year
 └── Unit
      └── Questions
           ├── ID
           ├── Question
           ├── Options
           ├── Correct Answer
           └── Explanation
```

Example:

```javascript
{
  id: "25-1-1",
  question: "What is the correct answer?",
  options: [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  answer: 2,
  explanation: "Explanation for the correct answer."
}
```

## 💡 Learning Outcomes

This project provided practical experience in:

* Building interactive browser-based applications
* JavaScript state and event management
* Dynamic DOM manipulation
* Designing reusable quiz logic
* Structuring large question datasets
* Responsive web design
* User interaction and validation
* Organizing a maintainable frontend project

## 🔮 Future Improvements

Planned improvements include:

* ⏱️ Quiz timer
* 📈 Performance analytics
* 🏆 Leaderboard
* 🔐 User accounts
* 💾 Progress persistence
* 📊 Topic-wise performance analysis
* 📥 Import/export question datasets
* 🌙 Dark mode
* 📱 Progressive Web App support

## 👨‍💻 Developer

**Devarinti Sai Rupesh**

B.Tech Computer Science & Engineering
NIT Patna — 2026 Graduate

This repository represents my implementation, development work, and continued maintenance of the NPTEL Study Assistant.

## 📄 License

This project is released under the MIT License.

---

⭐ If you find this project useful, consider giving the repository a star.
