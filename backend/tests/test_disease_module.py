import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_health_and_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "AgriSense AI"
    assert "Module 1" in data["supported_modules"][0]

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "farmer@agrisense.ai",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "farmer@agrisense.ai"
    assert data["user"]["role"] == "farmer"

def test_sample_images_endpoint():
    response = client.get("/api/v1/disease/sample-images")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) >= 4
    for sample in samples:
        assert "url" in sample
        assert "name" in sample

def test_disease_diagnosis_with_sample_image():
    # Login first
    login_res = client.post("/api/v1/auth/login", json={
        "email": "farmer@agrisense.ai",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sample_img_path = os.path.join(settings.SAMPLES_DIR, "sample_tomato_early_blight.jpg")
    assert os.path.exists(sample_img_path), f"Sample image missing at {sample_img_path}"

    with open(sample_img_path, "rb") as f:
        response = client.post(
            "/api/v1/disease/diagnose",
            files={"file": ("sample_tomato_early_blight.jpg", f, "image/jpeg")},
            data={"crop_hint": "Tomato", "notes": "Lower leaves showing brown target spots"},
            headers=headers
        )

    assert response.status_code == 200
    diag = response.json()
    assert diag["crop"] == "Tomato"
    assert "Early Blight" in diag["disease"]
    assert diag["confidence"] > 0.85
    assert "treatments" in diag
    assert "organic" in diag["treatments"]
    assert "chemical" in diag["treatments"]
    assert "heatmap_image_url" in diag
    assert "report_download_url" in diag
    assert "explainability" in diag
    assert len(diag["explainability"]["top_features"]) >= 3

    log_id = diag["id"]

    # Verify heatmap file created on disk
    heatmap_filename = os.path.basename(diag["heatmap_image_url"])
    assert os.path.exists(os.path.join(settings.HEATMAPS_DIR, heatmap_filename))

    # Verify PDF report download endpoint
    report_res = client.get(f"/api/v1/disease/report/{log_id}")
    assert report_res.status_code == 200
    assert report_res.headers["content-type"] == "application/pdf"
    assert len(report_res.content) > 1000

    # Verify history endpoint
    hist_res = client.get("/api/v1/disease/history", headers=headers)
    assert hist_res.status_code == 200
    hist = hist_res.json()
    assert len(hist) >= 1
    assert hist[0]["id"] == log_id

def test_disease_comparison():
    # Login first
    login_res = client.post("/api/v1/auth/login", json={
        "email": "farmer@agrisense.ai",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Diagnose 2 images (Before and After)
    sample_img_early = os.path.join(settings.SAMPLES_DIR, "sample_tomato_early_blight.jpg")
    sample_img_healthy = os.path.join(settings.SAMPLES_DIR, "sample_tomato_healthy.jpg")

    with open(sample_img_early, "rb") as f:
        res1 = client.post("/api/v1/disease/diagnose", files={"file": ("early.jpg", f, "image/jpeg")}, headers=headers)
    log1_id = res1.json()["id"]

    with open(sample_img_healthy, "rb") as f:
        res2 = client.post("/api/v1/disease/diagnose", files={"file": ("healthy.jpg", f, "image/jpeg")}, headers=headers)
    log2_id = res2.json()["id"]

    # Compare progression
    comp_res = client.post("/api/v1/disease/compare", json={
        "log_id_before": log1_id,
        "log_id_after": log2_id
    }, headers=headers)
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert "healing_progress_score" in comp_data
    assert "recovery_status" in comp_data
    assert "lesion_reduction_pct" in comp_data

def test_encyclopedia_and_experts():
    enc_res = client.get("/api/v1/disease/encyclopedia?crop=Tomato")
    assert enc_res.status_code == 200
    records = enc_res.json()
    assert len(records) >= 2

    exp_res = client.get("/api/v1/disease/experts?district=Mysuru")
    assert exp_res.status_code == 200
    experts = exp_res.json()
    assert len(experts) >= 1
    assert "KVK" in experts[0]["organization"] or "ICAR" in experts[0]["organization"]
