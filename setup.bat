@echo off
echo ============================================
echo  NuclearSystemChase - Dev Environment Setup
echo ============================================
echo.

REM Check prerequisites
echo Checking prerequisites...
echo.

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] Git - install with: winget install Git.Git
    set MISSING=1
) else (
    echo [OK] Git
)

dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] .NET SDK - install with: winget install Microsoft.DotNet.SDK.9
    set MISSING=1
) else (
    echo [OK] .NET SDK
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] Node.js - install with: winget install OpenJS.NodeJS.LTS
    set MISSING=1
) else (
    echo [OK] Node.js
)

code --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [MISSING] VS Code - install with: winget install Microsoft.VisualStudioCode
    set MISSING=1
) else (
    echo [OK] VS Code
)

if defined MISSING (
    echo.
    echo Install the missing tools above, then re-run this script.
    pause
    exit /b 1
)

echo.
echo All prerequisites found!
echo.

REM Install frontend dependencies
echo === Installing frontend dependencies ===
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend npm install failed!
    pause
    exit /b 1
)
cd ..

REM Set up .env if it doesn't exist
if not exist backend\.env (
    echo.
    echo === Creating backend\.env from template ===
    copy backend\.env.example backend\.env
    echo.
    echo *** IMPORTANT: Edit backend\.env and add your AZURE_CLIENT_SECRET ***
    echo.
)

REM Restore .NET dependencies
echo === Restoring .NET dependencies ===
cd backend
dotnet restore
if %errorlevel% neq 0 (
    echo .NET restore failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ============================================
echo  Setup complete!
echo ============================================
echo.
echo  Next steps:
echo   1. Edit backend\.env and add your AZURE_CLIENT_SECRET
echo      (optionally add ANTHROPIC_API_KEY for Claude email summaries)
echo   2. Double-click start.bat to launch both servers
echo      — or run manually:  cd backend ^&^& dotnet run
echo                           cd frontend ^&^& npm run dev
echo   3. Open browser:      http://localhost:3879
echo   4. Email dashboard:   http://localhost:3879/email
echo.
echo  MCP Server (for Claude Desktop):
echo   1. Copy claude-desktop-config.example.json settings
echo      into %%APPDATA%%\Claude\claude_desktop_config.json
echo   2. Update the project path to match this machine
echo   3. Restart Claude Desktop
echo.
pause
