"""
CarbonTrack - Unified Application Launcher
Starts FastAPI backend on port 8000 and Vite frontend on port 5173.
"""

import subprocess
import sys
import time
import os
import webbrowser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PYTHON_EXE = BASE_DIR / ".venv" / "Scripts" / "python.exe"

def main():
    print("=" * 60)
    print(" 🌱 CarbonTrack – Enterprise Footprint Auditor with Bias Mitigation")
    print("=" * 60)

    # 1. Start Backend
    print("[1/3] Starting FastAPI backend on http://127.0.0.1:8000 ...")
    env = os.environ.copy()
    env["PYTHONPATH"] = str(BASE_DIR / "backend")
    
    backend_proc = subprocess.Popen(
        [str(PYTHON_EXE), "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=str(BASE_DIR),
        env=env
    )

    # 2. Wait for backend startup
    time.sleep(2.5)

    # 3. Start Frontend
    print("[2/3] Starting Vite frontend on http://localhost:5173 ...")
    frontend_dir = BASE_DIR / "frontend"
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(frontend_dir)
    )

    time.sleep(2.0)
    print("\n" + "=" * 60)
    print(" 🚀 CarbonTrack is running!")
    print(" 👉 Web Application: http://localhost:5173")
    print(" 👉 API Documentation: http://127.0.0.1:8000/docs")
    print(" Press Ctrl+C in this terminal to gracefully terminate.")
    print("=" * 60 + "\n")

    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[CarbonTrack] Shutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("[CarbonTrack] Goodbye.")

if __name__ == "__main__":
    main()
