@echo off
REM Build and package the application for deployment to a client machine.
REM Output: .\dist\ folder with self-contained executable + React frontend

echo === Building React frontend ===
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b 1
)
cd ..

echo === Publishing .NET backend (self-contained) ===
cd backend
dotnet publish -c Release -r win-x64 --self-contained true -o ..\dist
if %errorlevel% neq 0 (
    echo Backend publish failed!
    exit /b 1
)
cd ..

echo.
echo === Build complete ===
echo Output folder: .\dist\
echo To run: .\dist\NuclearSystemChase.Api.exe
echo Then open http://localhost:5000 in a browser
