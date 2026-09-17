import os
import pickle
import numpy as np
import cv2

CLASS_PROTOTYPES = {
    "Tomato___Early_blight": [80, 100, 50],
    "Tomato___Late_blight": [70, 90, 40],
    "Tomato___healthy": [40, 140, 40],
    "Potato___Early_blight": [75, 95, 40],
    "Potato___healthy": [45, 135, 45],
    "Corn___Northern_Leaf_Blight": [220, 200, 100], # Yellowish/Pale for corn
    "Rice___Blast": [150, 160, 90],
    "Rice___healthy": [50, 150, 60],
    "Apple___Apple_scab": [180, 50, 60],
    "Grape___Black_rot": [60, 40, 80],
}

def extract_features(img_bgr):
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    hist_h = cv2.calcHist([hsv], [0], None, [8], [0, 180]).flatten()
    hist_s = cv2.calcHist([hsv], [1], None, [8], [0, 256]).flatten()
    return np.concatenate([hist_h, hist_s])

def create_synthetic_data(num_samples=100):
    X = []
    y = []
    class_map = {}
    
    for idx, (cls_name, base_rgb) in enumerate(CLASS_PROTOTYPES.items()):
        class_map[idx] = cls_name
        for _ in range(num_samples):
            patch = np.zeros((64, 64, 3), dtype=np.uint8)
            patch[:, :] = base_rgb
            noise = np.random.normal(0, 30, (64, 64, 3)).astype(np.int16)
            patch = np.clip(patch.astype(np.int16) + noise, 0, 255).astype(np.uint8)
            patch_bgr = cv2.cvtColor(patch, cv2.COLOR_RGB2BGR)
            features = extract_features(patch_bgr)
            X.append(features)
            y.append(idx)
            
    return np.array(X), np.array(y), class_map

if __name__ == "__main__":
    X, y, class_map = create_synthetic_data()
    save_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'models'))
    os.makedirs(save_dir, exist_ok=True)
    model_path = os.path.join(save_dir, 'knn_model_data.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump({"X": X, "y": y, "class_map": class_map}, f)
    print(f"KNN Dataset saved to {model_path}!")
