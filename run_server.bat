@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo    Setting up Smart Study Planner
echo ==========================================

:: Install dependencies
echo [1/4] Installing dependencies (this may take a while)...
call npm run install-all

:: Cleanup existing processes on ports 5173 and 5000 to prevent conflicts
echo Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

:: Start Backend
echo [2/4] Starting backend server...
start "Smart Study Planner - Backend" cmd /k "npm run backend"


:: Start Frontend
echo [3/4] Starting frontend server...
start "Smart Study Planner - Frontend" cmd /k "npm run frontend"

:: Wait for servers to initialize
echo [4/4] Waiting for servers to start (10s)...
timeout /t 10 /nobreak > NUL

:: Open browser
echo Launching application in browser...
start http://localhost:5173

echo.
echo Servers are running in separate windows.
echo If the browser didn't open, visit http://localhost:5173
echo.
pause