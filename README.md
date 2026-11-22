# 🚀 AI Interview Simulator

A modern, full-stack, responsive career preparation and interview simulation platform designed for college engineering students, powered by **PostgreSQL**, **Prisma ORM**, **JWT Authentication**, and **Bcrypt Password Security**.

Built with **React, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Node.js, Express, PostgreSQL, Prisma, and an intelligent multi-service AI abstraction**.

---

## 🌟 Highlights & Features

1. **PostgreSQL Database & Prisma ORM Integration**:
   - Production-ready PostgreSQL database with Prisma ORM client.
   - Clean relational schema supporting Users, Test Results, Resume Analyses, Interview Sessions, Job Matches, Documents, and AI Chat Messages.
   - Secure input validation, password hashing with bcrypt, and session management using JSON Web Tokens (JWT).

2. **Complete User Authentication System**:
   - **User Registration (Sign Up)**: Full name, Email address, Password, Confirm password, with instant client & server input validation, duplicate email detection, and bcrypt hashing before database persistence.
   - **User Login (Sign In)**: Email and password authentication with bcrypt verification, JWT generation, secure session storage, and friendly error handling.
   - **Session Persistence**: User authentication state persists automatically across page refreshes and browser restarts via verified JWT tokens.
   - **Protected Routes & Data Privacy**: Users can only access their own private information. Unauthorized requests are rejected.
   - **Logout Option**: Instant one-click session termination and secure token clearance available across Navbar and Sidebar.
   - **1-Click Instant Demo Login**: Instant access with the pre-seeded Alex Kumar student profile for seamless testing and demonstration.

3. **Study Material & Notes Module**:
   - Upload syllabus notes and chapters via **PDF, DOCX, TXT**, or paste text notes directly.
   - Structured hierarchy organizer: **Subject $\rightarrow$ Chapter $\rightarrow$ Topic**.
   - Direct 1-click **Generate MCQs** from uploaded documents.

4. **AI MCQ Generator**:
   - Configurable question sets: 5, 10, 20, 30, or custom counts.
   - Difficulty selection: Easy, Medium, Hard, or Mixed.
   - Question formats: Multiple Choice (4 options) or True / False.
   - Question preview with toggleable explanations and direct test launcher.

5. **Professional Online Test System**:
   - Real-time countdown timer (e.g., `18:32`).
   - Interactive question palette with color-coded status: **Answered (Green)**, **Unanswered (Gray)**, and **Marked for Review (Amber)**.
   - Previous, Next, Mark for Review, and Submit Test modal with answered/unanswered counts.

6. **Detailed Test Results & Accuracy**:
   - High-impact score card (e.g. **78 / 100**, **78% Accuracy**).
   - Metrics: Correct, Wrong, Unanswered, Time Taken, and Accuracy %.
   - Visual topic accuracy breakdown chart using Recharts.
   - Confetti animation on high scores!

7. **Areas to Improve (Weak Area Detection)**:
   - 🔴 **High Priority**: Weakest concepts (< 50%) with specific action steps.
   - 🟡 **Medium Priority**: Intermediate topics (50% - 75%).
   - 🟢 **Strong Areas**: Concepts mastered (> 75%).
   - **"Practice This Topic Again"** button to launch an instant targeted mini-assessment.
   - Recommended Next Steps checklist.

8. **AI Resume Analyzer**:
   - Drag-and-drop resume upload (PDF/DOCX) or 1-click load of sample resume.
   - Large circular SVG score gauge: **8.2 / 10**.
   - 7 category score breakdown: **Skills, Projects, Education, Experience, Formatting, ATS Compatibility, and Keywords**.
   - Key Strengths and Areas to Improve callouts.
   - Section-by-section AI rewrite suggestions with 1-click copy for project bullets and summary statements.

9. **Job Description Matcher & History**:
   - Compare resume against real job postings (Job Title, Company, Description).
   - Match Score out of 10 and Keyword Match percentage.
   - Tagged **Matching Skills** (✅) and **Missing Skills** (❌).
   - Actionable recommendations and specific resume changes recommended.
   - Searchable **Job Match History** table with modal detail view.

10. **AI Career Assistant Chatbot**:
    - Interactive assistant covering Java, Spring Boot, DSA, Python, Web Dev, DBMS, OS, Networks, HR rounds, and project reviews.
    - Markdown code block rendering, quick suggestion prompt pills, typing indicator, and copy actions.

11. **Turn-by-Turn AI Mock Interview Practice**:
    - Select target role: Java Developer, Full Stack Developer, Backend Developer, Software Engineer, Data Analyst, Python Developer.
    - Select format: Technical, HR, Behavioral, Mixed.
    - Select difficulty: Beginner, Intermediate, Advanced.
    - AI interviewer asks questions sequentially, evaluates candidate responses in real-time, and generates a final scorecard covering **Technical Depth, Communication, Answer Quality, Missing Concepts, and Recommended Topics**.

12. **Student Dashboard & User Profile Management**:
    - Displays authenticated user's name, email, target role, academic credentials, and statistics.
    - Modal profile editor allowing instant updates to full name, college, degree program, specialization, and verified placement skills.

---

## 📐 Architecture & Technology Stack

```
ai-interview-simulator/
├── client/                     # Vite + React 19 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/common/  # Navbar, Sidebar, ScoreCircle, ProgressBar, StatCard, Modal, Skeleton, DashboardLayout
│   │   ├── context/            # AuthContext (JWT + Session persistence), ThemeContext (Dark/Light)
│   │   ├── pages/              # LoginPage, DashboardPage, ProfilePage, etc.
│   │   ├── services/api.ts     # Frontend REST client with auto-attached JWT headers
│   │   └── types/index.ts      # Shared TypeScript data models
│   ├── .env                    # Client environment configuration
│   ├── .env.example
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript (ESM) + PostgreSQL + Prisma
│   ├── prisma/
│   │   └── schema.prisma       # Prisma schema for PostgreSQL
│   ├── src/
│   │   ├── lib/
│   │   │   ├── prisma.ts       # Singleton PrismaClient instance
│   │   │   └── seed.ts         # Automatic seed for demo user & mock data
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT authentication middleware (requireAuth, optionalAuth)
│   │   ├── routes/             # auth, profile, documents, mcq, tests, resume, jobMatch, chat, interview, analytics
│   │   ├── services/           # aiService.ts, dbService.ts, fileParser.ts
│   │   ├── test-auth-db.ts     # Automated end-to-end authentication & database test suite
│   │   └── index.ts            # Server entry point
│   ├── .env                    # Server environment configuration
│   ├── .env.example
│   └── package.json
├── .env.example                # Unified example environment file
└── package.json                # Root automation scripts
```

---

## 🗄️ Database Schema (PostgreSQL & Prisma)

The database models are defined in `server/prisma/schema.prisma`:

### `users` Table
- `id` (String, Primary Key, UUID)
- `fullName` (String, required)
- `email` (String, Unique, required)
- `passwordHash` (String, bcrypt hashed, required)
- `college` (String, optional)
- `degree` (String, optional)
- `targetRole` (String, optional)
- `skills` (String[], array of skills)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Relational Tables (Prepared for Future Features)
- `interview_sessions` $\rightarrow$ Foreign key `userId` to `users(id)` with `onDelete: Cascade`
- `test_results` $\rightarrow$ Foreign key `userId` to `users(id)` with `onDelete: Cascade`
- `resume_analyses` $\rightarrow$ Foreign key `userId` to `users(id)` with `onDelete: Cascade`
- `chat_messages` $\rightarrow$ Foreign key `userId` to `users(id)` with `onDelete: Cascade`
- `documents` $\rightarrow$ Foreign key `userId` to `users(id)` with `onDelete: Cascade`
- `job_matches` $\rightarrow$ Foreign key `userId` to `users(id)` with `onDelete: Cascade`

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js** (v18+ or v24+ recommended)
- **npm** (v9+ or v11+)
- **PostgreSQL** (v14, v15, or v16)

---

### Step 1: Install and Start PostgreSQL

#### On macOS (using Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### On Ubuntu / Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Create the Database:
```bash
# Create the interview_simulator database
createdb interview_simulator
```

---

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Ensure your `server/.env` contains your PostgreSQL credentials:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/interview_simulator?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
```

2. Copy `.env.example` to `client/.env`:
```bash
cp client/.env.example client/.env
```
Ensure `client/.env` points to the backend API:
```env
VITE_API_URL="http://localhost:5000/api"
```

---

### Step 3: Run Database Migrations & Sync

Synchronize the Prisma schema with PostgreSQL:
```bash
# From the project root:
npm run db:push
npm run db:generate

# Or directly in the server directory:
cd server
npx prisma db push
npx prisma generate
```

---

### Step 4: Run Automated Tests

To verify that all 8 core features (Database connectivity, User registration, Duplicate email rejection, Login with correct credentials, Login with incorrect credentials, Logout, Session persistence, and Protected routes) are passing:
```bash
# Run test suite from root
npm run test:auth
```

All 46 test assertions will execute against your live PostgreSQL instance.

---

### Step 5: Start the Application

You can start the backend and frontend separately or simultaneously:

#### Option A: Run concurrently from root
```bash
# In terminal 1 (Backend):
npm run dev:server

# In terminal 2 (Frontend):
npm run dev:client
```

#### Option B: Run in separate folders
```bash
# Terminal 1: Backend Server (http://localhost:5000)
cd server
npm run dev

# Terminal 2: Frontend Client (http://localhost:5173)
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 👤 Login Credentials & Testing Accounts

### 1. New Account Registration
1. Navigate to `http://localhost:5173/login`
2. Click **Sign Up**
3. Enter your **Full Name**, **Email Address**, **Password** (min. 6 characters), and **Confirm Password**.
4. Click **Complete Registration**. You will be securely saved into PostgreSQL and redirected to your personalized dashboard!

### 2. Pre-seeded Demo Student Account
- **Email**: `alex.kumar@example.com`
- **Password**: `password123`
- Or simply click the **"1-Click Instant Demo Login (Alex Kumar)"** button on the Sign In page.
