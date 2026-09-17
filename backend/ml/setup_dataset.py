import os
import zipfile
import shutil
import random

ZIP_PATH = r"C:\Users\small\Downloads\plantvillagedataset.zip.zip"
TARGET_DIR = r"c:\Users\small\OneDrive\Documents\majorproject\backend\dataset"

print("1. Extracting dataset... This may take a moment for 700MB.")
if os.path.exists(TARGET_DIR):
    shutil.rmtree(TARGET_DIR)
os.makedirs(TARGET_DIR, exist_ok=True)

with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
    zip_ref.extractall(TARGET_DIR)

print("2. Restructuring into train/val if necessary...")
train_dir = os.path.join(TARGET_DIR, 'train')
val_dir = os.path.join(TARGET_DIR, 'val')

# PlantVillage datasets sometimes extract into a subfolder like 'plantvillage dataset/color'
# Let's find the deepest directory that actually contains class folders.
def find_class_folders(base_dir):
    for root, dirs, files in os.walk(base_dir):
        # If we find directories that contain images, these are class folders
        has_images = any(f.lower().endswith(('.png', '.jpg', '.jpeg')) for f in files)
        if has_images:
            return os.path.dirname(root) # The parent of the class folder
    return base_dir

root_with_classes = find_class_folders(TARGET_DIR)

# If the root isn't already split into train/val, we split it automatically
if not os.path.exists(os.path.join(TARGET_DIR, 'train')):
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)
    
    # We found the base directory containing class folders like "Tomato___Early_blight"
    classes = [d for d in os.listdir(root_with_classes) if os.path.isdir(os.path.join(root_with_classes, d))]
    
    for cls in classes:
        cls_path = os.path.join(root_with_classes, cls)
        images = [f for f in os.listdir(cls_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        random.shuffle(images)
        
        split_idx = int(len(images) * 0.8)
        train_imgs = images[:split_idx]
        val_imgs = images[split_idx:]
        
        os.makedirs(os.path.join(train_dir, cls), exist_ok=True)
        os.makedirs(os.path.join(val_dir, cls), exist_ok=True)
        
        for img in train_imgs:
            shutil.move(os.path.join(cls_path, img), os.path.join(train_dir, cls, img))
        for img in val_imgs:
            shutil.move(os.path.join(cls_path, img), os.path.join(val_dir, cls, img))
            
    # Cleanup original empty folders
    for cls in classes:
        try:
            os.rmdir(os.path.join(root_with_classes, cls))
        except:
            pass

print("Dataset is fully prepared for CNN.")
