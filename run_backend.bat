@echo off
title CarbonTrack Backend API (FastAPI)
cd /d "%~dp0"
echo ========================================================
echo  Starting CarbonTrack Backend (FastAPI + SQLite + AI)
echo ========================================================
set PYTHONPATH=backend
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
