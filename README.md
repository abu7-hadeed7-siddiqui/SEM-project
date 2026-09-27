# LEARNOVA — Intelligent Course & Resource Recommendation System

> **A Complete, Production-Grade Software Engineering Capstone Project**  
> Built with React (Vite, Tailwind CSS, Framer Motion), Python (Flask, PyMySQL, Flask-JWT-Extended), and MySQL 8.0+.

---

## 🌟 Project Overview

**LEARNOVA** is an intelligent educational recommendation platform designed to eliminate curriculum paralysis for engineering students and self-directed learners. Instead of superficial hard-coded recommendations, LEARNOVA employs an extensible **Strategy Pattern** recommendation engine that synthesizes:
1. **Current Skill Profile** (languages, frameworks, CS fundamentals)
2. **Career & Learning Objectives** (e.g., Full Stack, AI/ML, System Design)
3. **Difficulty Horizon** (Beginner, Intermediate, Advanced with strict upper-bound enforcement)
4. **Prerequisite Compatibility** (verifies prerequisite skills before recommending advanced modules)
5. **Continuous Learner Feedback Loop** (interactive 1–5 star ratings dynamically re-rank future recommendations)
6. **Popularity-Based Cold-Start Fallback** (non-crashing fallback for uncalibrated user profiles)

The system generates a ranked **TOP 5** recommendation list with explicit rationale explanations for each match.

---

## 🏗️ Architectural Design

LEARNOVA strictly implements a clean 4-tier separation of concerns:

```
┌────────────────────────────────────────────────────────┐
│             Presentation Layer (Client)                │
│       React 19 + Vite + Tailwind CSS + Framer Motion    │
└───────────────────────────┬────────────────────────────┘
                            │ REST JSON (Bearer JWT)
┌───────────────────────────▼────────────────────────────┐
│              Presentation / Routes (Flask)             │
│   AuthRoutes │ ProfileRoutes │ RecRoutes │ AdminRoutes │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                 Application / Service Layer            │
│   AuthService │ ProfileService │ RecommendationService │
│                      AdminService                      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Domain Layer                        │
│   RecommendationEngine (Orchestrator)                  │
│   ├── Strategy: TagOverlapStrategy                     │
│   └── Strategy: PopularityStrategy                     │
│   Models: User, Profile, Resource, Recommendation, Rating│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Persistence / Repository Layer            │
│   UserRepository │ ProfileRepository │ ResourceRepository│
│        RecommendationRepository │ RatingRepository     │
└───────────────────────────┬────────────────────────────┘
                            │ Parameterized SQL
┌───────────────────────────▼────────────────────────────┐
│                     MySQL 8.0+                         │
│  users ── profiles ── recommendations ── ratings ── res│
└────────────────────────────────────────────────────────┘
```

---

## 🧠 Recommendation Engine & The Strategy Pattern

The recommendation engine strictly adheres to the **Strategy Pattern** (`app/domain/strategies/recommendation_strategies.py`). The `RecommendationEngine` orchestrator accepts any `RecommendationStrategy` interface without knowing its internal implementation details.

### 1. TagOverlapStrategy (Personalized Ranking)
When a user profile has at least one skill or goal, this strategy computes a normalized composite score in the range `[0.0, 1.0]`:

$$\text{Score} = 0.30 \cdot S + 0.25 \cdot G + 0.20 \cdot D + 0.15 \cdot P + 0.10 \cdot R$$

Where:
- **$S$ (Skill Overlap, 30%):** Jaccard/set overlap between user's current skills and resource topic tags.
- **$G$ (Goal Overlap, 25%):** Keyword overlap between tokenized career goals and resource tags.
- **$D$ (Difficulty Fit, 20%):** Penalty distance based on learner difficulty versus resource difficulty.
- **$P$ (Prerequisite Fit, 15%):** Proportion of course prerequisites satisfied by the learner's skill profile.
- **$R$ (Community Rating Signal, 10%):** Normalized average rating of the resource ($\text{average\_rating} / 5.0$).

### 2. PopularityStrategy (Cold-Start Fallback)
If a user registers without specifying skills or goals, the system automatically activates `PopularityStrategy` rather than failing or returning empty data:

$$\text{Popularity Score} = \min\left( \frac{\text{Average Rating} \times \ln(\text{Rating Count} + 1)}{35.0}, 1.0 \right)$$

Recommendations are flagged with a visible **"COLD START"** badge on the dashboard.

### 3. Prerequisite & Difficulty Constraints
- **Upper-Bound Restriction:** A Beginner learner will *never* receive Intermediate or Advanced recommendations.
- **Prerequisite Validation:** Resources with required prerequisites (e.g. *Advanced Data Structures* requiring *Programming Fundamentals* and *Data Structures*) require at least 50% prerequisite satisfaction to be eligible.

---

## 💻 Tech Stack

| Tier | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, React Router DOM |
| **Backend** | Python 3.10+, Flask 3.1+, Flask-JWT-Extended, Flask-Bcrypt, PyMySQL, Python-Dotenv |
| **Database** | MySQL 8.0+ (InnoDB, Foreign Key Cascades, Parameterized SQL, JSON fields) |
| **Testing** | Pytest (25/25 automated unit & integration tests) |
| **Design System** | Deep charcoal (`#0F0F14`), Violet (`#7C3AED`), Emerald (`#10B981`) |

---

## 📁 Repository Directory Structure

```
d:/SEM PROJECT/
├── backend/
│   ├── app/
│   │   ├── config/              # Environment & Flask app settings
│   │   ├── domain/
│   │   │   ├── models/          # User, Profile, Resource, Recommendation, Rating
│   │   │   ├── strategies/      # TagOverlapStrategy, PopularityStrategy
│   │   │   └── recommendation_engine.py
│   │   ├── presentation/
│   │   │   └── routes/          # auth, profile, recommendations, admin blueprints
│   │   ├── repositories/        # SQL data access layers (PyMySQL parameterized)
│   │   ├── services/            # Business & application logic
│   │   └── utils/               # Database connection pool & helpers
│   ├── tests/
│   │   └── test_all.py          # Complete 25-test Pytest test suite
│   ├── .env                     # Local backend environment configuration
│   └── run.py                   # Flask server entry point (Port 5000)
├── database/
│   ├── schema.sql               # MySQL 8+ DDL (users, profiles, resources, recommendations, ratings)
│   └── seed.sql                 # 71 realistic curated courses, demo users, and rating history
├── docs/
│   └── diagrams/                # Mermaid UML source diagrams
│       ├── use_case_diagram.md
│       ├── class_diagram.md
│       ├── sequence_diagram.md
│       ├── activity_diagram.md
│       └── er_diagram.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # ResourceModal, DeleteConfirmModal
│   │   │   ├── common/          # Navbar, Footer, StarRating, Toast
│   │   │   └── recommendations/ # RecommendationCard, SkeletonCard
│   │   ├── context/             # AuthContext (JWT, user, profile state)
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, DashboardPage, ProfilePage, HistoryPage, AdminDashboardPage
│   │   ├── services/            # api.js fetch client with JWT interceptor
│   │   ├── App.jsx              # Routes & Protected/Admin Guards
│   │   └── index.css            # Tailwind CSS v4 styling & dark theme
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Learner Persona** | `student@learnova.local` | `Student@1234` | Dashboard, Recommendations, Rating Loop, Profile, History |
| **Administrator** | `admin@learnova.local` | `Admin@1234` | Full Resource CRUD, System Analytics, Category Metrics |
| **New Learner** | *Register any new email* | *Min 8 chars, 1 uppercase, 1 digit* | Fresh Onboarding & Profile Setup |

---

## 🚀 Installation & Local Setup

### 1. Database Setup (MySQL 8.0+)
Open your MySQL client or shell:
```sql
-- Ensure MySQL service is running on port 3306
-- Execute schema and seed data
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
Alternatively using `mysqlsh`:
```powershell
mysqlsh --uri root:PASSWORD@localhost --sql --file database/schema.sql
mysqlsh --uri root:PASSWORD@localhost --sql --file database/seed.sql
```

### 2. Backend Setup (Flask API)
```powershell
cd "d:\SEM PROJECT\backend"

# Install Python requirements
python -m pip install flask flask-cors flask-jwt-extended flask-bcrypt pymysql pytest python-dotenv

# Verify and execute password sync script (ensures local bcrypt hashes match)
python fix_passwords.py

# Run all 25 automated tests
python -m pytest tests/test_all.py -v

# Start the Flask API server (runs on http://127.0.0.1:5000)
python run.py
```

### 3. Frontend Setup (React + Vite)
```powershell
cd "d:\SEM PROJECT\frontend"

# Install dependencies
npm install

# Run the development server (runs on http://localhost:5173)
npm run dev
```

The frontend includes a built-in proxy in `vite.config.js` routing `/api/*` directly to `http://127.0.0.1:5000`.

---

## 🧪 Testing Coverage (Pytest)

The backend test suite (`backend/tests/test_all.py`) validates 25 comprehensive scenarios:
- **Authentication:** Registration success, duplicate email rejection, invalid email syntax, password complexity requirements.
- **Login Verification:** Password verification, incorrect password response, non-existent account, generic error messaging.
- **Recommendation Strategies:** Tuple return integrity, skill matching weight assertion, popularity scoring scaling, swapability of strategies.
- **Recommendation Engine:** TOP 5 result slicing, algorithm version tracking, difficulty constraint enforcement, cold-start fallback activation, score sorting order.
- **Profile Validation:** Mandatory skill or goal enforcement, profile update persistence.
- **Rating Feedback Loop:** Range bounds verification ($1 \le \text{rating} \le 5$).
- **Role-Based Authorization:** Learner blocked from admin endpoints ($403$), admin access verified ($200$), admin resource creation ($201$).

Execute tests anytime with:
```powershell
cd backend
python -m pytest tests/test_all.py -v
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & initialize profile | No |
| `POST` | `/api/auth/login` | Authenticate and issue JWT | No |
| `POST` | `/api/auth/logout` | Discard session / token | Yes |
| `GET` | `/api/profile` | Retrieve learner profile and skills | Yes (Bearer) |
| `PUT` | `/api/profile` | Update skills, goals, and difficulty | Yes (Bearer) |
| `GET` | `/api/recommendations` | Retrieve latest or cached Top 5 | Yes (Bearer) |
| `POST` | `/api/recommendations/generate` | Force real-time recommendation recalculation | Yes (Bearer) |
| `GET` | `/api/recommendations/history` | Historical audit trail of recommendations | Yes (Bearer) |
| `POST` | `/api/recommendations/ratings` | Submit/update 1–5 star rating | Yes (Bearer) |
| `GET` | `/api/admin/stats` | System telemetry & category ratings | Admin Only |
| `GET` | `/api/admin/resources` | Paginated catalog search and filters | Admin Only |
| `POST` | `/api/admin/resources` | Create new curriculum resource | Admin Only |
| `PUT` | `/api/admin/resources/<id>` | Update curriculum resource | Admin Only |
| `DELETE` | `/api/admin/resources/<id>` | Cascade-safe delete resource | Admin Only |

---

## 📊 Software Engineering UML Documentation

All UML diagrams are documented in standard GitHub-compatible Mermaid markdown in [`docs/diagrams/`](file:///d:/SEM%20PROJECT/docs/diagrams/README.md):
- **[Use Case Diagram](file:///d:/SEM%20PROJECT/docs/diagrams/use_case_diagram.md)**
- **[Class Diagram](file:///d:/SEM%20PROJECT/docs/diagrams/class_diagram.md)**
- **[Sequence Diagram](file:///d:/SEM%20PROJECT/docs/diagrams/sequence_diagram.md)**
- **[Activity Diagram](file:///d:/SEM%20PROJECT/docs/diagrams/activity_diagram.md)**
- **[Entity-Relationship (ER) Diagram](file:///d:/SEM%20PROJECT/docs/diagrams/er_diagram.md)**

---

## 💡 Troubleshooting & FAQ

1. **MySQL Access Denied (Error 1045):**
   - Ensure the password in `backend/.env` matches your local MySQL `root` password (`DB_PASSWORD=...`).
2. **CORS / Network Connection:**
   - Both Flask CORS (`CORS(app)`) and Vite proxy are preconfigured for seamless zero-config local communication.
3. **Password Hash Verification:**
   - Run `python fix_passwords.py` inside `backend/` to ensure demo seed passwords align with local bcrypt salting.
