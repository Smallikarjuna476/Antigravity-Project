@echo off
echo ========================================================
echo Start Smart Agri Ecosystem (AgriSense AI)
echo ========================================================

echo [1/2] Starting FastAPI Backend...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting React Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up! 
echo - Backend will be available at: http://localhost:8000
echo - Frontend will be available at: http://localhost:5173
echo.
echo Close this window at any time. The servers run in separate terminal windows.
pause
