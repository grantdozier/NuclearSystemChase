@echo off
setlocal
cd /d "%~dp0..\.."

echo === Email Agent — Chase Group CC ===
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install Python 3.11+ and add it to PATH.
    pause
    exit /b 1
)

:: Create venv if missing
if not exist "email_agent\.venv" (
    echo Creating virtual environment...
    python -m venv email_agent\.venv
)

:: Activate and install deps
call email_agent\.venv\Scripts\activate.bat
pip install -q -r email_agent\requirements.txt

:: Copy env if missing
if not exist "email_agent\config\.env" (
    if exist "email_agent\config\.env.example" (
        copy "email_agent\config\.env.example" "email_agent\config\.env" >nul
        echo.
        echo  IMPORTANT: Edit email_agent\config\.env and fill in your credentials.
        echo  Then re-run this script.
        echo.
        pause
        exit /b 0
    )
)

echo.
echo Starting Email Agent dashboard on http://127.0.0.1:8765
echo Press Ctrl+C to stop.
echo.
start "" http://127.0.0.1:8765
python -m email_agent.run serve
