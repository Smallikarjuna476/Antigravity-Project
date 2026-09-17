# 🌱 AgriSense AI - Intelligent Agriculture Decision Support Platform

![AgriSense AI Banner](https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=1200)

## 📌 Overview
**AgriSense AI** is an enterprise-grade, comprehensive agricultural decision support system leveraging Artificial Intelligence, geospatial analytics, and comprehensive temporal datasets to optimize farming protocols. 

Our architecture bridges the gap between sophisticated ML pipelines (Explainable AI diagnostics, predictive yield modeling, geospatial twin mapping) and a modernized, ultra-responsive frontend operational dashboard—serving as a cohesive **Operating System for Smart Agriculture.**

---

## 🚀 Key Features

*   **🦠 Diagnostic XAI Engine:** Deep-learning inference endpoints for hyperspectral crop disease detection using Grad-CAM heat-mappings (Module 1/3).
*   **🤖 AI Agronomist Chatbot:** Secure RAG-based context-aware agricultural assistant (Module 2).
*   **🌦 Microclimate Intelligence:** Real-time weather API integration modeling hyper-local parameters (Module 4).
*   **📊 Market Arbitrage Matrix:** Advanced commodity intelligence tracking APMC mandi prices and algorithmic yield projections (Module 5/11).
*   **🌍 Smart Crop Planner:** Geospatial integration detecting viable crop alignments relative to soil biome and monsoon timelines (Module 6).
*   **🏛 Scheme Gateway:** Automated filtration connecting rural operations with state/federal subsidies like PM-KISAN (Module 8).
*   **🗺 Spatial Digital Twin**: Real-time mock ingestion of moisture and biomass variables rendered on an interactive map (Module 12).
*   **📖 Community & Knowledge Hub:** Integrated peer-to-peer forum architectures with downloadable expert agricultural literature endpoints (Module 13/14).

---

## 🛠 Technology Stack

### **Backend (Data & AI Layer)**
- **Framework:** FastAPI (Python 3.11)
- **Database:** SQLite3 / SQLAlchemy ORM
- **Testing:** Pytest & TestClient
- **Auth:** JWT Bearer (Token-based Stateless Security)

### **Frontend (Presentation Layer)**
- **Framework:** React + TypeScript (Vite)
- **Styling:** TailwindCSS + Lucide Icons
- **Data Visualization:** Recharts
- **Mapping:** React-Leaflet

### **Infrastructure (DevOps & Deployment)**
- **Containerization:** Docker Compose
- **CI/CD:** GitHub Actions YAML Pipelines

---

## ⚙️ Quick Start (Local Deployment)

Run our automated batch execution engine on Windows:
```bash
# Execute within the root directory
run_project.bat
```
*This command natively executes both the Uvicorn FastAPI backend server (Port: 8000) and the Vite Frontend local server (Port: 5173).*

Alternatively, via Docker:
```bash
docker-compose up --build -d
```

## 🔒 License
This repository is marked proprietary strictly for academic review and implementation regarding the Major Project submission guidelines.
