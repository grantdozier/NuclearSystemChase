@echo off
setlocal
cd /d "%~dp0"

echo === Chase Group Construction — Starting App ===
echo.

echo [1/2] Starting backend (http://localhost:5000)...
start "CGC Backend" cmd /k "cd backend && dotnet run"

echo [2/2] Starting frontend (http://localhost:3879)...
start "CGC Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start "" http://localhost:3879

echo.
echo Both services are running. Close the terminal windows to stop.
