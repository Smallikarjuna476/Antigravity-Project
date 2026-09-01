# Smart Agri Ecosystem – AI Powered Crop Advisory & Market Intelligence Platform

## Overview
**AgriSense AI** (Smart Agri Ecosystem) is a comprehensive, production-ready full-stack AI platform tailored for the agricultural sector. It assists farmers with AI-driven, data-backed decision-making to optimize crop health, maximize yield, and improve economic outcomes. This platform aligns directly with SDG Goal 2 (Zero Hunger) by enabling precision agronomy for smallholder and commercial farmers alike.

## Key Modules
1. **Crop Disease Detection & Pathology** (Module 1): Computes affected lesion areas, severity, and provides AI-driven prescriptive treatments backed by efficient Convolutional Neural Networks and Grad-CAM interpretability.
2. **Precision Crop Planner** (Module 2): Algorithmic chronological scheduling mapped against local phenology and geospatial soil factors.
3. **Autonomous Agronomy Assistant** (Module 3): Real-time chat interface powered by deep natural language capabilities, allowing farmers to query issues conversationally.
4. **Economic Yield & Market Simulator** (Module 4): Price predictions and volume metrics leveraging regression over environmental heuristics.
5. **Weather & Environment Insights**: Direct integration with meteorological parameters for proactive planning.
6. **Government Schemes Integration**: A persistent, up-to-date registry mapping farmers to applicable KCC and agricultural subsidies.
7. **Farm Journal & Soil Intelligence**: Personal telemetry tracking allowing farmers to historically verify and audit crop progress, NPK variance, and pH integrity over time.

## Architecture & Tech Stack

### Frontend (Client-side)
- **Framework**: React.js 18
- **Tooling**: Vite for High-Speed Module Replacement
- **Typing**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons (Dark/Light Theming natively supported)

### Backend (Server-side)
- **Framework**: FastAPI (Python 3.11)
- **Database**: SQLite with SQLAlchemy ORM (ACID Compliant)
- **Security**: JWT (JSON Web Tokens) with Argon2/Bcrypt hash salting for authentication boundaries.
- **Reporting**: ReportLab for generation of dynamic, exportable agronomic PDF certificates.

### Deployment & DevOps
- **Docker**: Dual-image configurations orchestrated via Docker Compose.
- **Dependencies**: Streamlined via `requirements.txt` and `package.json` for reproducible builds.

## Setup & Execution

### Option 1: Docker 🐳 (Recommended)
You can deploy the entire stack using Docker:
```bash
# In the root directory (where docker-compose.yml is located)
docker-compose up --build
```
- The backend will run on `http://localhost:8000`
- The frontend will be available at `http://localhost:3000`

### Option 2: Local Native Execution
**1. Backend Setup**
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python seed_data.py # Seed the database
uvicorn app.main:app --reload
```

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## Documentation
- The comprehensive IEEE-Style Architecture Report can be found in `documentation/IEEE_Project_Report.md`.
- Backend endpoints feature strict doc-strings adhering to algorithm complexity evaluations inline with IEEE standard expectations.

## License
MIT License.
