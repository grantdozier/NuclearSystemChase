@echo off
echo ============================================
echo  NuclearSystemChase - Starting Dev Servers
echo ============================================
echo.

set ROOT=%~dp0
set BACKEND_PORT=5050
set FRONTEND_PORT=3879

REM --- Free up our ports if anything is squatting on them ---
echo [pre] Cleaning up stale processes on ports %BACKEND_PORT% and %FRONTEND_PORT%...

REM Stop the installed Task Scheduler instance if it's running
schtasks /Query /TN "Chase Group CRM" >nul 2>&1
if %errorlevel%==0 (
    echo   - Stopping installed "Chase Group CRM" scheduled task...
    schtasks /End /TN "Chase Group CRM" >nul 2>&1
)

REM Kill any process listening on our ports (only LISTENING, not other states)
for %%P in (%BACKEND_PORT% %FRONTEND_PORT%) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P " ^| findstr "LISTENING"') do (
        echo   - Port %%P held by PID %%A - killing
        taskkill /F /PID %%A >nul 2>&1
    )
)

REM Clean up any stray published-exe instances
taskkill /F /IM NuclearSystemChase.Api.exe >nul 2>&1

echo.
echo [1/3] Starting backend (http://localhost:%BACKEND_PORT%)...
start "NSC Backend" cmd /k "cd /d "%ROOT%backend" && dotnet run"

echo [2/3] Starting frontend (http://localhost:%FRONTEND_PORT%)...
start "NSC Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo [3/3] Waiting for servers to come up...
timeout /t 6 /nobreak >nul

echo Opening http://localhost:%FRONTEND_PORT% in Chrome...
start "" "chrome.exe" "http://localhost:%FRONTEND_PORT%"
if %errorlevel% neq 0 start "" "http://localhost:%FRONTEND_PORT%"

echo.
echo Both servers are running in their own windows.
echo Close those windows (or press Ctrl+C in each) to stop.
echo.
