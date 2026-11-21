@echo off
title CarbonTrack - Enterprise Footprint Auditor
cd /d "%~dp0"
echo ========================================================
echo  Launching CarbonTrack - Full Stack Platform
echo ========================================================
echo Starting Backend API on http://127.0.0.1:8000 ...
start "CarbonTrack Backend" cmd /k "run_backend.bat"

echo Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo Starting Frontend Dev Server on http://localhost:5173 ...
start "CarbonTrack Frontend" cmd /k "run_frontend.bat"

echo.
echo ========================================================
echo  CarbonTrack is running!
echo  Frontend UI: http://localhost:5173
echo  Backend API Docs: http://127.0.0.1:8000/docs
echo ========================================================
