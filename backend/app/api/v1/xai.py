from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/xai", tags=["Module 1: Explainable AI Tensors"])

@router.get("/samples")
async def get_xai_samples() -> List[Dict[str, Any]]:
    """
    Returns pre-compiled Explainable AI (XAI) Grad-CAM attention heatmap telemetry logs.
    """
    return [
        {
            "id": "xai-samp-01",
            "name": "Tomato Early Blight",
            "confidence": 98.4,
            "baseImage": "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800",
            "heatmapStyle": "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/60 via-amber-500/20 to-transparent",
            "heatmapPosition": "top-[20%] left-[30%] w-[40%] h-[50%]",
            "reasoning": "The convolutional neural network strongly activates around concentric necrotic rings with chlorotic halos, characteristic of Alternaria solani."
        },
        {
            "id": "xai-samp-02",
            "name": "Healthy Maize Leaf",
            "confidence": 99.1,
            "baseImage": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
            "heatmapStyle": "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/30 via-emerald-400/10 to-transparent",
            "heatmapPosition": "top-[10%] left-[10%] w-[80%] h-[80%]",
            "reasoning": "Uniform distributed activation across the leaf blade. No distinct focal lesions detected. High confidence in photosynthetic integrity."
        },
        {
            "id": "xai-samp-03",
            "name": "Potato Late Blight",
            "confidence": 94.7,
            "baseImage": "https://images.unsplash.com/photo-1587824151216-56bebc14fb1e?auto=format&fit=crop&q=80&w=800",
            "heatmapStyle": "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/60 via-purple-500/20 to-transparent",
            "heatmapPosition": "top-[40%] left-[50%] w-[35%] h-[45%]",
            "reasoning": "Saliency map highlights irregular water-soaked edge lesions indicating Phytophthora infestans sporangiophores."
        }
    ]

@router.get("/features")
async def get_feature_impacts() -> Dict[str, Any]:
    return {
        "features": [
            { "name": 'Necrotic Rings', "impact": 85 },
            { "name": 'Chlorotic Halo', "impact": 72 },
            { "name": 'Leaf Venation', "impact": 15 },
            { "name": 'Stem Color', "impact": 8 },
            { "name": 'Background', "impact": 2 },
        ],
        "radar": [
            { "subject": 'Texture Analysis', "A": 95, "fullMark": 100 },
            { "subject": 'Color Degradation', "A": 88, "fullMark": 100 },
            { "subject": 'Shape Recognition', "A": 92, "fullMark": 100 },
            { "subject": 'Spatial Geometry', "A": 75, "fullMark": 100 },
            { "subject": 'Edge Detection', "A": 89, "fullMark": 100 },
            { "subject": 'Background Sep', "A": 99, "fullMark": 100 },
        ]
    }
