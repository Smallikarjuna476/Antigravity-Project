# AgriSense AI: CNN Model Training Guide

This guide explains EXACTLY how to switch the application from the fallback K-Nearest Neighbors (KNN) model to the genuine **MobileNetV2 Convolutional Neural Network (CNN)**.

## Step 1: Download the PlantVillage Dataset

The CNN requires hundreds of plant images to "learn" what diseases look like.

1. Go to Kaggle (it's free): https://www.kaggle.com/datasets/emmarex/plantdisease
2. Click the **"Download"** button on the dataset page.
3. You will receive a ZIP file containing folders of leaf images.

*(Alternative: You can use absolutely any plant disease dataset from the internet, as long as it follows the folder structure below).*

## Step 2: Extract & Structure the Folders

Extract the images directly into your project's `backend` directory so that it looks EXACTLY like this:

```text
majorproject/
  backend/
    dataset/
      train/
        Tomato___Early_blight/
           image01.jpg
           image02.jpg
        Corn___Northern_Leaf_Blight/
           image01.jpg
           image02.jpg
      val/
        Tomato___Early_blight/
           image99.jpg
        Corn___Northern_Leaf_Blight/
           image99.jpg
```

**CRITICAL RULES:**
* The folder names (e.g., `Tomato___Early_blight`) dictate the exact class name the CNN will output, so name them carefully!
* You must have BOTH a `train/` folder (for the CNN to learn) and a `val/` folder (for the CNN to test itself). Put ~80% of your images in `train` and ~20% in `val`.

## Step 3: Run the Training Pipeline

Once the folders are meticulously structured, open your project terminal (Command Prompt or PowerShell) and run:

```bash
cd backend
call venv\Scripts\activate
pip install tensorflow numpy pillow opencv-python
python ml/train_mobilenet.py
```

## Step 4: Watch it Learn

The training script will automatically:
1. Detect all the classes in your folders.
2. Download the pre-trained ImageNet weights for MobileNetV2.
3. Process your images at `224x224` resolution.
4. Export the final trained brain to `backend/ml/models/plant_disease_mobilenetv2.keras`.

## Step 5: Profit! (Restart the Application)

Once training reaches 100% and successfully saves the model, simply restart your AgriSense backend server. 

When you boot the server up, `ai_disease_engine.py` will automatically detect the `.keras` model, disable the Fallback KNN, and start utilizing the **MobileNetV2 CNN** alongside the **TensorFlow Grad-CAM** engine for all future disease predictions!
