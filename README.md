# 🚀 AI Interview Simulator

A modern, full-stack, responsive career preparation and interview simulation platform designed for college engineering students.

Built with **React, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Node.js, Express, and an intelligent multi-service AI abstraction**.

---

## 🌟 Highlights & Features

1. **Study Material & Notes Module**:
   - Upload syllabus notes and chapters via **PDF, DOCX, TXT**, or paste text notes directly.
   - Structured hierarchy organizer: **Subject $\rightarrow$ Chapter $\rightarrow$ Topic**.
   - Direct 1-click **Generate MCQs** from uploaded documents.

2. **AI MCQ Generator**:
   - Configurable question sets: 5, 10, 20, 30, or custom counts.
   - Difficulty selection: Easy, Medium, Hard, or Mixed.
   - Question formats: Multiple Choice (4 options) or True / False.
   - Question preview with toggleable explanations and direct test launcher.

3. **Professional Online Test System**:
   - Real-time countdown timer (e.g., `18:32`).
   - Interactive question palette with color-coded status: **Answered (Green)**, **Unanswered (Gray)**, and **Marked for Review (Amber)**.
   - Previous, Next, Mark for Review, and Submit Test modal with answered/unanswered counts.

4. **Detailed Test Results & Accuracy**:
   - High-impact score card (e.g. **78 / 100**, **78% Accuracy**).
   - Metrics: Correct, Wrong, Unanswered, Time Taken, and Accuracy %.
   - Visual topic accuracy breakdown chart using Recharts.
   - Confetti animation on high scores!

5. **Areas to Improve (Weak Area Detection)**:
   - 🔴 **High Priority**: Weakest concepts (< 50%) with specific action steps.
   - 🟡 **Medium Priority**: Intermediate topics (50% - 75%).
   - 🟢 **Strong Areas**: Concepts mastered (> 75%).
   - **"Practice This Topic Again"** button to launch an instant targeted mini-assessment.
   - Recommended Next Steps checklist.

6. **Comprehensive Question Review**:
   - Inspect every test question with candidate's choice, correct choice, topic tag, difficulty pill, and AI explanation.

7. **AI Resume Analyzer**:
   - Drag-and-drop resume upload (PDF/DOCX) or 1-click load of Alex Kumar's sample resume.
   - Large circular SVG score gauge: **8.2 / 10**.
   - 7 category score breakdown: **Skills, Projects, Education, Experience, Formatting, ATS Compatibility, and Keywords**.
   - Key Strengths and Areas to Improve callouts.
   - Section-by-section AI rewrite suggestions with 1-click copy for project bullets and summary statements.

8. **Job Description Matcher & History**:
   - Compare resume against real job postings (Job Title, Company, Description).
   - Match Score out of 10 and Keyword Match percentage.
   - Tagged **Matching Skills** (✅) and **Missing Skills** (❌).
   - Actionable recommendations and specific resume changes recommended.
   - Searchable **Job Match History** table with modal detail view.

9. **AI Career Assistant Chatbot**:
   - Interactive assistant covering Java, Spring Boot, DSA, Python, Web Dev, DBMS, OS, Networks, HR rounds, and project reviews.
   - Markdown code block rendering, quick suggestion prompt pills, typing indicator, and copy actions.

10. **Turn-by-Turn AI Mock Interview Practice**:
    - Select target role: Java Developer, Full Stack Developer, Backend Developer, Software Engineer, Data Analyst, Python Developer.
    - Select format: Technical, HR, Behavioral, Mixed.
    - Select difficulty: Beginner, Intermediate, Advanced.
    - AI interviewer asks questions sequentially, evaluates candidate responses in real-time, and generates a final scorecard covering **Technical Depth, Communication, Answer Quality, Missing Concepts, and Recommended Topics**.

11. **Student Dashboard & Progress Analytics**:
    - 6 KPI metric cards, performance line chart over time, weak areas widget, recent tests table, and time filters (7d, 30d, 3m, all time).

12. **Dark / Light Mode**:
    - High-contrast sleek dark theme and clean light theme with instant persistence.

---

## 📐 Architecture & Technology Stack

```
ai-interview-simulator/
├── client/                     # Vite + React 18/19 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/common/  # Navbar, Sidebar, ScoreCircle, ProgressBar, StatCard, Modal, Skeleton
│   │   ├── context/            # AuthContext (Alex Kumar demo), ThemeContext (Dark/Light)
│   │   ├── pages/              # 14 complete responsive page views
│   │   ├── services/api.ts     # Frontend REST API client
│   │   └── types/index.ts      # Shared TypeScript data types
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript (ESM)
│   ├── src/
│   │   ├── data/db.json        # Persistent JSON-backed storage preloaded with Alex Kumar data
│   │   ├── routes/             # auth, documents, mcq, tests, resume, jobMatch, chat, interview, analytics, profile
│   │   ├── services/
│   │   │   ├── aiService.ts    # 8-module AI engine abstraction + domain heuristics
│   │   │   ├── dbService.ts    # Relational CRUD data layer
│   │   │   └── fileParser.ts   # Text extraction for TXT, DOCX, and PDF files
│   │   └── index.ts            # Express server entry point on port 5000
│   └── package.json
└── package.json                # Root automation scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v24+ recommended)
- npm (v9+ or v11+)

### 1. Running the Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start on **http://localhost:5000**.
Health check: `GET http://localhost:5000/api/health`

### 2. Running the Frontend Client
```bash
cd client
npm install
npm run dev
```
The Vite development application will be available at **http://localhost:5173**.

---

## 👤 Demo Student Account
The platform is pre-loaded with complete demo data for:
- **Name**: Alex Kumar
- **Email**: `alex.kumar@example.com`
- **College**: National Institute of Technology
- **Degree**: B.Tech in Computer Science & Engineering
- **Target Role**: Java Backend Developer
- **Preloaded Tests**: Computer Networks (78%), Core Java (85%), DBMS (68%).
- **Preloaded Resume ATS Score**: 8.2 / 10.
- **Preloaded Job Matches**: FinTech Global Inc (8.4/10) & TechCorp Systems (9.1/10).

Click **"1-Click Instant Demo Login"** on the Login screen to log in immediately without credentials!
