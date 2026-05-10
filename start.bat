@echo off
echo ============================
echo AI Control Studio - Startup
echo ============================
echo.

echo [1/2] Starting API server...
start cmd /k "title AI-API && cd /d %~dp0apps\api && npx tsx src\index.ts"
timeout /t 5 /nobreak >nul

echo [2/2] Starting Web server...
start cmd /k "title AI-WEB && cd /d %~dp0apps\web && npx next dev --port 3000"

echo.
echo ============================
echo  API:  http://localhost:4000
echo  Web:  http://localhost:3000
echo ============================
echo.
pause
