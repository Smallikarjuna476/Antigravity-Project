import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_forum_get_posts():
    response = client.get("/api/v1/forum/posts?category=All&search=")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "title" in data[0]

def test_analytics_metrics():
    response = client.get("/api/v1/analytics/metrics?timeframe=season")
    assert response.status_code == 200
    data = response.json()
    assert "yield_data" in data
    assert "disease_incidence" in data
    assert "ai_accuracy" in data

def test_xai_samples():
    response = client.get("/api/v1/xai/samples")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "heatmapStyle" in data[0]

def test_xai_features():
    response = client.get("/api/v1/xai/features")
    assert response.status_code == 200
    data = response.json()
    assert "features" in data
    assert "radar" in data

def test_digital_twin_status():
    response = client.get("/api/v1/twin/status")
    assert response.status_code == 200
    data = response.json()
    assert "farmPolygon" in data
    assert "centerPoint" in data
    assert "moistureData" in data

def test_hub_articles():
    response = client.get("/api/v1/hub/articles?category=All&search=")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "category" in data[0]

def test_unknown_hub_article():
    response = client.get("/api/v1/hub/articles?search=NONEXISTENT12345")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
