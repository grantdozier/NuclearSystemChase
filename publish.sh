#!/bin/bash
# Build and package the application for deployment to a client machine.
# Output: ./dist/ folder with self-contained executable + React frontend

set -e

echo "=== Building React frontend ==="
cd frontend
npm run build
cd ..

echo "=== Publishing .NET backend (self-contained) ==="
cd backend
dotnet publish -c Release -r win-x64 --self-contained true -o ../dist
cd ..

echo ""
echo "=== Build complete ==="
echo "Output folder: ./dist/"
echo "To run: ./dist/NuclearSystemChase.Api.exe"
echo "Then open http://localhost:5000 in a browser"
