import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1 import auth, disease, assistant, weather, planner, schemes, journal, yield_sim, forum, analytics, xai, twin, hub
from seed_data import seed_database

# Initialize DB tables
Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed default users and disease database on startup
    seed_database()
    yield

app = FastAPI(
    title="AgriSense AI - Intelligent Agriculture Decision Support API",
    description="Enterprise-Grade AI Agricultural Decision Support Platform API for disease diagnosis, weather, market intelligence, soil optimization, and digital farming.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CORSStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

# Mount static directories for uploads, heatmaps, reports, and samples
app.mount("/static", CORSStaticFiles(directory=settings.STATIC_DIR), name="static")

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(disease.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)
app.include_router(planner.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)

app.include_router(journal.router, prefix=settings.API_V1_STR)
app.include_router(yield_sim.router, prefix=settings.API_V1_STR)
app.include_router(forum.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(xai.router, prefix=settings.API_V1_STR)
app.include_router(twin.router, prefix=settings.API_V1_STR)
app.include_router(hub.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "platform": "AgriSense AI",
        "version": settings.VERSION,
        "status": "Online & Healthy",
        "docs": "/docs",
        "supported_modules": [
            "Module 1: AI Crop Disease Detection & Grad-CAM Heatmaps",
            "Module 2: Multilingual Farming Assistant",
            "Module 3: Smart Weather Intelligence",
            "Module 4: Market Intelligence & Price Prediction",
            "Module 5: Smart Crop Planner",
            "Module 7: Government Schemes Recommender",

            "Module 9: Smart Farm Journal",
            "Module 10: Analytics Dashboard",
            "Module 11: Emergency Alert Center",
            "Module 12: Knowledge Center",
            "Module 13: Community Forum",
            "Module 14: Report Generator"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AgriSense Backend Engine"}
