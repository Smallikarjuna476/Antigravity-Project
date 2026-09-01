import os
import cv2
import numpy as np
from PIL import Image, ImageDraw

def create_sample_images():
    samples_dir = os.path.join(os.path.dirname(__file__), "app", "static", "samples")
    os.makedirs(samples_dir, exist_ok=True)

    # Base canvas size
    size = (600, 600)

    # 1. Healthy Leaf
    img_healthy = Image.new("RGB", size, (240, 245, 240))
    draw = ImageDraw.Draw(img_healthy)
    
    # Leaf body polygon
    leaf_pts = [
        (300, 50), (450, 150), (520, 300), (480, 440),
        (320, 530), (300, 560), (280, 530), (120, 440),
        (80, 300), (150, 150)
    ]
    draw.polygon(leaf_pts, fill=(46, 125, 50), outline=(27, 94, 32))
    
    # Main midrib vein
    draw.line([(300, 50), (300, 560)], fill=(76, 175, 80), width=6)
    # Side lateral veins
    for y, off in [(150, 120), (220, 160), (300, 180), (380, 150), (450, 100)]:
        draw.line([(300, y), (300 + off, y - 40)], fill=(76, 175, 80), width=3)
        draw.line([(300, y), (300 - off, y - 40)], fill=(76, 175, 80), width=3)

    img_healthy.save(os.path.join(samples_dir, "sample_tomato_healthy.jpg"), "JPEG", quality=95)

    # 2. Tomato Early Blight (Concentric rings + yellow halos)
    img_early = img_healthy.copy()
    draw_early = ImageDraw.Draw(img_early)

    # Draw chlorotic yellow patches
    draw_early.ellipse([200, 180, 320, 300], fill=(190, 180, 40))
    draw_early.ellipse([340, 260, 450, 370], fill=(195, 175, 35))
    draw_early.ellipse([160, 340, 280, 460], fill=(185, 170, 30))

    # Draw concentric dark brown necrotic rings
    for center, radius in [((260, 240), 45), ((395, 315), 38), ((220, 400), 40)]:
        for r in range(radius, 5, -8):
            color = (60, 35, 20) if r % 16 == 0 else (100, 60, 30)
            draw_early.ellipse([center[0]-r, center[1]-r, center[0]+r, center[1]+r], outline=color, width=3)
        draw_early.ellipse([center[0]-8, center[1]-8, center[0]+8, center[1]+8], fill=(40, 20, 10))

    img_early.save(os.path.join(samples_dir, "sample_tomato_early_blight.jpg"), "JPEG", quality=95)

    # 3. Potato Late Blight (Irregular dark water-soaked blotches)
    img_late = img_healthy.copy()
    draw_late = ImageDraw.Draw(img_late)

    # Large dark brown water-soaked blotches at margins
    draw_late.polygon([(100, 220), (220, 200), (260, 280), (180, 360), (90, 320)], fill=(45, 30, 20), outline=(160, 150, 80))
    draw_late.polygon([(420, 160), (510, 240), (470, 360), (380, 320), (390, 220)], fill=(40, 25, 15), outline=(150, 140, 70))
    draw_late.polygon([(260, 420), (360, 440), (330, 520), (240, 500)], fill=(50, 35, 25), outline=(170, 160, 90))
    # Pale mildew fuzzy fringe
    draw_late.arc([90, 190, 270, 370], start=0, end=180, fill=(210, 215, 205), width=4)

    img_late.save(os.path.join(samples_dir, "sample_potato_late_blight.jpg"), "JPEG", quality=95)

    # 4. Rice Blast (Spindle/diamond-shaped lesions)
    img_rice = Image.new("RGB", size, (245, 248, 245))
    draw_rice = ImageDraw.Draw(img_rice)
    
    # Long slender paddy leaf
    rice_pts = [(300, 20), (360, 200), (350, 450), (300, 580), (250, 450), (240, 200)]
    draw_rice.polygon(rice_pts, fill=(56, 142, 60), outline=(27, 94, 32))
    draw_rice.line([(300, 20), (300, 580)], fill=(129, 199, 132), width=4)

    # Diamond / Spindle lesions with gray centers and reddish margins
    for cy in [140, 240, 340, 440]:
        cx = 285 if cy % 80 == 0 else 315
        # Reddish brown outer diamond
        draw_rice.polygon([(cx, cy - 35), (cx + 20, cy), (cx, cy + 35), (cx - 20, cy)], fill=(120, 40, 25), outline=(180, 60, 30))
        # Grayish necrotic center
        draw_rice.polygon([(cx, cy - 20), (cx + 10, cy), (cx, cy + 20), (cx - 10, cy)], fill=(190, 195, 190))

    img_rice.save(os.path.join(samples_dir, "sample_rice_blast.jpg"), "JPEG", quality=95)
    print("All sample crop images generated successfully in:", samples_dir)

if __name__ == "__main__":
    create_sample_images()
