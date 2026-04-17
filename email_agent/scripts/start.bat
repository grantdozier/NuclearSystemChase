@echo off
:: Replacement for the repo root start.bat — launches both NuclearSystemChase and Email Agent.
setlocal
cd /d "%~dp0..\.."

echo === Chase Group CC — Full Stack Startup ===
echo.

:: --- Backend ---
echo [1/3] Starting NuclearSystemChase backend (port 5000)...
start "NSC Backend" cmd /k "cd backend && dotnet run"
timeout /t 3 /nobreak >nul

:: --- Frontend ---
echo [2/3] Starting NuclearSystemChase frontend (port 3879)...
start "NSC Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

:: --- Email Agent ---
echo [3/3] Starting Email Agent dashboard (port 8765)...
start "Email Agent" cmd /k "call email_agent\scripts\start_email_agent.bat"

echo.
echo All services starting. Opening browser tabs...
timeout /t 5 /nobreak >nul
start "" http://localhost:3879
start "" http://127.0.0.1:8765

echo.
echo Close the individual terminal windows to stop each service.
