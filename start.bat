@echo off
echo ============================================
echo  NuclearSystemChase - Starting Dev Servers
echo ============================================
echo.

REM Get the repo root so paths work from any directory
set ROOT=%~dp0

REM Start backend in its own window
echo [1/3] Starting backend (http://localhost:5000)...
start "NSC Backend" cmd /k "cd /d "%ROOT%backend" && dotnet run"

REM Start frontend in its own window
echo [2/3] Starting frontend (http://localhost:3879)...
start "NSC Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

REM Wait for Vite to come up (~5s is usually enough), then open Chrome
echo [3/3] Waiting for servers to start...
timeout /t 6 /nobreak >nul

echo Opening http://localhost:3879 in Chrome...
start "" "chrome.exe" "http://localhost:3879"

REM Fallback: if Chrome isn't on PATH, use the default browser
if %errorlevel% neq 0 (
    start "" "http://localhost:3879"
)

echo.
echo Both servers are running in their own windows.
echo Close those windows (or press Ctrl+C in each) to stop.
echo.
