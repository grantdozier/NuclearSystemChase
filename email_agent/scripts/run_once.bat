@echo off
setlocal
cd /d "%~dp0..\.."

call email_agent\.venv\Scripts\activate.bat 2>nul || (
    echo Run start_email_agent.bat first to set up the environment.
    pause
    exit /b 1
)

echo Running email pipeline once...
python -m email_agent.run once
pause
